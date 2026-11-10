import iconAi from '../assets/avatars/icon_ai.jpg'
import iconAoi from '../assets/avatars/icon_aoi.jpg'
import iconCca from '../assets/avatars/icon_cca.jpg'
import iconChk from '../assets/avatars/icon_chk.jpg'
import iconChn from '../assets/avatars/icon_chn.jpg'
import iconChs from '../assets/avatars/icon_chs.jpg'
import iconHrk from '../assets/avatars/icon_hrk.jpg'
import iconKan from '../assets/avatars/icon_kan.jpg'
import iconKkr from '../assets/avatars/icon_kkr.jpg'
import iconKor from '../assets/avatars/icon_kor.jpg'
import iconKtn from '../assets/avatars/icon_ktn.jpg'
import iconMei from '../assets/avatars/icon_mei.jpg'
import iconMhk from '../assets/avatars/icon_mhk.jpg'
import iconMku from '../assets/avatars/icon_mku.jpg'
import iconMna from '../assets/avatars/icon_mna.jpg'
import iconNgs from '../assets/avatars/icon_ngs.jpg'
import iconRei from '../assets/avatars/icon_rei.jpg'
import iconRik from '../assets/avatars/icon_rik.jpg'
import iconRio from '../assets/avatars/icon_rio.jpg'
import iconRui from '../assets/avatars/icon_rui.jpg'
import iconSki from '../assets/avatars/icon_ski.jpg'
import iconSkr from '../assets/avatars/icon_skr.jpg'
import iconSmr from '../assets/avatars/icon_smr.jpg'
import iconSuz from '../assets/avatars/icon_suz.jpg'
import iconSzk from '../assets/avatars/icon_szk.jpg'
import iconYo from '../assets/avatars/icon_yo.jpg'
import iconYu from '../assets/avatars/icon_yu.jpg'

const avatars = {
  'icon_ai.jpg': iconAi,
  'icon_aoi.jpg': iconAoi,
  'icon_cca.jpg': iconCca,
  'icon_chk.jpg': iconChk,
  'icon_chn.jpg': iconChn,
  'icon_chs.jpg': iconChs,
  'icon_hrk.jpg': iconHrk,
  'icon_kan.jpg': iconKan,
  'icon_kkr.jpg': iconKkr,
  'icon_kor.jpg': iconKor,
  'icon_ktn.jpg': iconKtn,
  'icon_mei.jpg': iconMei,
  'icon_mhk.jpg': iconMhk,
  'icon_mku.jpg': iconMku,
  'icon_mna.jpg': iconMna,
  'icon_ngs.jpg': iconNgs,
  'icon_rei.jpg': iconRei,
  'icon_rik.jpg': iconRik,
  'icon_rio.jpg': iconRio,
  'icon_rui.jpg': iconRui,
  'icon_ski.jpg': iconSki,
  'icon_skr.jpg': iconSkr,
  'icon_smr.jpg': iconSmr,
  'icon_suz.jpg': iconSuz,
  'icon_szk.jpg': iconSzk,
  'icon_yo.jpg': iconYo,
  'icon_yu.jpg': iconYu,
}

export type AvatarfileName = keyof typeof avatars

export function getAvatar(image: AvatarfileName): Uint8Array {
  const avatar = avatars[image]
  if (!avatar) {
    throw new Error(`Unknown avatar: ${image}`)
  }
  return avatar
}
