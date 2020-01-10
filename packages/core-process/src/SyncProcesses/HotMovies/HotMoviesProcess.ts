import os from 'os'
import $ from 'cheerio'

import { fs } from '@nofrills/fs'
import { Star, StarAttributes } from '../@sosus/core-models'
import { Caches, SystemContext } from '@sosus/data-system'
import { StarDocument, PeopleContext } from '@sosus/data-people'
import {
  inject,
  Scheduler,
  injectable,
  Logger,
  Merge,
  scoped,
  Lifecycle,
  Hash,
  Lincoln,
  Job,
  DeepPartial,
} from '@sosus/core'

import { SyncProcess } from '../SyncProcess'
import { SyncSingleResult } from '../SyncSingleResult'
import { SyncConfig, DefaultSyncConfig } from '../SyncConfig'
import { SyncCollectionResult } from '../SyncCollectionResult'

import {
  transformAliases,
  transformBirthDate,
  echo,
  transformGender,
  transformBoolean,
  transformYearsActive,
  cleanSlug,
  cleanName,
} from './StringParsers'

export type StarSync = StarDocument & PouchDB.Core.RevisionIdMeta

export interface HotMoviesSyncResults extends SyncCollectionResult<StarSync> {}

export interface HotMoviesSyncResult extends SyncSingleResult<StarSync> {}

export interface HotMoviesSyncConfig extends SyncConfig {
  url: string
}

export const HotMoviesSyncOptionsType = Symbol('HotMoviesSyncOptions')

export const DefaultHotMoviesSyncConfig: DeepPartial<HotMoviesSyncConfig> = {
  ...DefaultSyncConfig,
  name: 'hotmovies',
  url: 'https://www.hotmovies.com/porn-star/?subletter=all&letter=<LETTER>&star_gender_pref=1&star_view_pref=photos',
}

interface FunctionMap {
  key: string
  parse: (value: string, attributes: DeepPartial<StarAttributes>) => void
}

function* alphabet() {
  for (let index = 0; index < 26; index++) {
    yield String.fromCharCode(97 + index)
  }
}

const TRANSFORMERS: { [key: string]: FunctionMap } = {
  Alias: { key: 'aliases', parse: transformAliases },
  Aliases: { key: 'aliases', parse: transformAliases },
  Born: { key: 'dob_string', parse: transformBirthDate },
  'Birth Place': { key: 'place_of_birth', parse: echo },
  'Breast Size': { key: 'breast_size', parse: echo },
  Ethnicity: { key: 'ethnicity', parse: echo },
  'Eye Color': { key: 'color_eyes', parse: echo },
  Gender: { key: 'gender', parse: transformGender },
  Height: { key: 'height', parse: echo },
  Implants: { key: 'implants', parse: transformBoolean },
  Piercings: { key: 'piercings', parse: echo },
  Tattoos: { key: 'tattoos', parse: echo },
  'Typical Hair Color': { key: 'color_hair', parse: echo },
  'Years Active': { key: 'years', parse: transformYearsActive },
}

@injectable()
@scoped(Lifecycle.ContainerScoped)
export class HotMoviesProcess extends SyncProcess<Star, HotMoviesSyncConfig> {
  private readonly log: Lincoln

  private jobs: Job[] = []

  readonly name: string = 'hot-movies-process'

  constructor(
    @inject(HotMoviesSyncOptionsType) options: HotMoviesSyncConfig,
    scheduler: Scheduler,
    system: SystemContext,
    private readonly people: PeopleContext,
  ) {
    super(options, scheduler, system)
    this.log = Logger.extend(this.name)
    this.log.debug(options)
  }

  async cancel() {
    this.jobs.map(job => job.cancel(false))
    this.jobs = []
  }

  async start() {
    if (this.jobs.length === 0) {
      const count = await this.people.stars.count()

      if (count === 0) {
        this.log.debug('first-time-setup', this.config.name)
        await this.sync()
      }

      const primary = this.schedule(this.config.name, this.config.cron.primary, async () => {
        try {
          const results = await this.sync()
          this.log.trace(results)
        } catch (error) {
          this.log.error(error)
        }
      })

      let current = this.getNextAvailable(this.system.cache, this.createIterator())
      const secondaryName = this.config.name + '-star'

      const secondary = this.schedule(secondaryName, this.config.cron.secondary, async () => {
        try {
          const next = await current.next()

          if (next.done === false && next.value) {
            const star = await this.parseStar(next.value)
            this.log.trace(star.attributes)
            return
          }

          current = this.getNextAvailable(this.system.cache, this.createIterator())
        } catch (error) {
          this.log.error(error)
        }
      })

      this.log.debug('create-job-primary', primary.name)
      this.log.debug('create-job-secondary', secondary.name)
      this.jobs = [primary, secondary]
    }

    return this
  }

  protected async *createIterator() {
    for (const letter of alphabet()) {
      try {
        const url = this.config.url.replace('<LETTER>', letter)
        const buffer = await this.download(url)
        const $html = $.load(buffer.buffer, { lowerCaseTags: true })
        const parsed = await this.parseStars($html)
        this.log.trace(parsed)

        for (const star of parsed) {
          yield star
        }
      } catch (error) {
        this.log.error(error)
      }
    }
  }

  protected createConfig(): DeepPartial<HotMoviesSyncConfig> {
    return DefaultHotMoviesSyncConfig
  }

  protected createResult(item: StarSync, error?: Error): HotMoviesSyncResult {
    return { error, item, name: '', success: error === undefined }
  }

  protected createResults(items: StarSync[], error?: Error): HotMoviesSyncResults {
    return { error, items, name: '', success: error === undefined }
  }

  protected async finalizeResults(items: StarSync[], error?: Error): Promise<SyncCollectionResult<StarSync>> {
    const stars = items.map(item => this.people.stars.createDocument(item))
    const results = await this.people.stars.bulk(stars)
    this.log.trace('finalize-results', ...stars, ...results)
    return this.createResults(stars as StarSync[], error)
  }

  protected async syncItem(item: StarSync): Promise<StarSync> {
    return item
  }

  private async *getNextAvailable(caches: Caches, iterator: AsyncGenerator<StarSync, void, unknown>) {
    let next = await iterator.next()

    do {
      if (next.done === false && next.value) {
        const star = next.value
        const id = caches.keyId({ source: { key: Hash(star._id), origin: star.profile } })
        const exists = await caches.exists(id)

        if (exists === undefined) {
          this.log.debug('next-available', star._id)
          yield star
        }
      }

      next = await iterator.next()
    } while (next.done === false)
  }

  private async parseStar(star: StarSync): Promise<StarSync> {
    try {
      const buffer = await this.download(star.profile, star.refresh)
      const $html = $.load(buffer.buffer)

      const attributes: DeepPartial<StarAttributes> = {}

      const primary = $html('#imgStarGalleryFocus')
        .attr('src')
        ?.trim()

      const gallery = $html('#star_smallimg_wrap div.star_smallimg_item img')

      if (primary) {
        attributes.images = [primary]

        gallery.each((_, element) => {
          const href = $html(element).attr('data-large-image')
          attributes.images?.push(href!)
        })

        this.log.trace('images', attributes.images)
      }

      attributes.biography = $html('div.long_description')
        .html()
        ?.trim()

      // tslint:disable-next-line:variable-name
      const attributes_text = $html('div.star_info')
        .text()
        .trim()
        .split(os.EOL)

      this.log.trace('attributes_text', attributes_text)

      attributes_text.forEach(text => {
        try {
          const regex = /^([\w\s]+):([\w\s/;'].*)$/g

          if (regex.test(text)) {
            const parts = text.split(':')
            const key = parts[0].trim()
            const value = parts[1].trim()

            if (TRANSFORMERS[key]) {
              const property = TRANSFORMERS[key]
              attributes[property.key] = property.parse(value, attributes)
            }
          }
        } catch (error) {
          this.log.error(error)
        }
      })

      star.attributes = Merge<StarAttributes>([star.attributes, attributes])
      this.log.trace('attributes', star.attributes)

      const updated = await this.people.stars.update(star)

      const image = await this.download(updated.image, updated.refresh)
      this.log.debug(updated._id, updated._rev)

      await this.people.stars.putAttachment(
        updated._id,
        updated._rev,
        fs.basename(star.image),
        image.cache.content_type,
        image.buffer,
      )

      return updated
    } catch (error) {
      this.log.error(error)
    }

    return star
  }

  private async parseStars($: CheerioStatic): Promise<StarSync[]> {
    const cells = Array.from($('#stars_list div.cell'))
    const stars = new Set<StarSync>()

    const tasks = cells.map(async (cell: CheerioElement) => {
      const inner = $('div.stars-list-inner', cell)

      const profile = $('h3 a', inner)
        .attr('href')!
        .trim()

      const name = $('h3 a', inner)
        .text()
        .trim()

      const image = $('div.star-photo-wrap img', inner)
        .attr('src')!
        .trim()

      const slug = cleanSlug(name)

      const star: StarSync = Merge<StarSync>([
        this.people.stars.createDocument({
          image,
          profile,
          slug,
          description: name,
          stage_name: name.trim(),
          stage_name_normalized: cleanName(name),
        }),
      ])

      stars.add(star)
    }, [])

    await Promise.all(tasks)

    return Array.from(stars.values())
  }
}
