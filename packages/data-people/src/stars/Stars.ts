import { Documents, DocumentIndexOptions } from '@sosus/core-data'
import { StarKeys } from '@sosus/core-models'

import { StarDocument } from './StarDocument'

export class Stars extends Documents<StarDocument> {
  readonly indexes: DocumentIndexOptions[] = [
    {
      index: {
        fields: ['attributes.dob'],
        name: 'actor_attributes-dob',
      },
    },
    {
      index: {
        fields: ['attributes.ethnicity'],
        name: 'actor_attributes-ethnicity',
      },
    },
    {
      index: {
        fields: ['attributes.color_eyes'],
        name: 'actor_attributes-color-eyes',
      },
    },
    {
      index: {
        fields: ['attributes.color_hair'],
        name: 'actor_attributes-color-hair',
      },
    },
    {
      index: {
        fields: ['attributes.years.end'],
        name: 'actor_attributes-years-end',
      },
    },
    {
      index: {
        fields: ['attributes.years.start'],
        name: 'actor_attributes-years-start',
      },
    },
    {
      index: {
        fields: ['attributes.zodiac_sign'],
        name: 'actor_attributes-zodiac-sign',
      },
    },
    {
      index: {
        fields: ['gender'],
        name: 'actor_gender',
      },
    },
    {
      index: {
        fields: ['stage_name'],
        name: 'actor_stage_name',
      },
    },
    {
      index: {
        fields: ['slug'],
        name: 'actor_slug',
      },
    },
    {
      index: {
        fields: ['source.key'],
        name: 'actor_source-key',
      },
    },
    {
      index: {
        fields: ['source.origin'],
        name: 'actor_source-origin',
      },
    },
  ]

  protected get keyProperties() {
    return StarKeys
  }
}
