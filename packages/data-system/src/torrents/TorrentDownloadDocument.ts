import { Document } from '@sosus/core-data'
import { TorrentDownload } from '@sosus/core-models'

export interface TorrentDownloadDocument extends Document, TorrentDownload {}
