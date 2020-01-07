import { TorrentStatus } from './types/TorrentStatus'

export interface TorrentDownload {
  status: TorrentStatus
  torrent_id: string
}

export const TorrentDownloadKeys = ['torrent_id']
