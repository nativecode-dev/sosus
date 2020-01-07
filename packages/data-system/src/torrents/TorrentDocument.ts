import { Document } from '@sosus/core-data'
import { Torrent } from '@sosus/core-models'

export interface TorrentDocument extends Document, Torrent {}
