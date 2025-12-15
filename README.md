# 🎶 SpoFree
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fredretep%2Fspofree%2F)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/redretep/spofree)

SpoFree is a free, open-source, and ad-free music player based on Tidal with Hi-Res sound. It has a clean interface similar to Spotify.
<img src="https://raw.githubusercontent.com/redretep/spofree/ae27a51a154f159ff419b094830b916c00a6a4a2/images/album.jpeg" width="100%">

## Features

- ❌**Ad-Free Listening** from Tidal
- 💿**Lossless Audio** for hifi sound
- 🎧**Huge Catalogue** powered by the full TIDAL library and HiFi APIs
- 🔲**Clean UI** similar to Spotify
- 🎶**Playlist Support** create and import your own Playlists
- 📁**Local Storage** playlists, liked songs, recently listened saved via IndexDB in your browser
- 🔎**Search** find media and sort by album, track, artist, or playlist
- 💾**Export** songs, playlists, albums and liked songs as csv or zip containing lossless .flac files
- ⏰**Sleep Timer** with customizable length
- 🔢**Queue** that you can save as a playlist and customize
- 🎵**Media Session API** for lock screen and control center support
- 📶**Library Tabs** Organized library with Playlists, Liked Songs, Saved Albums, and Followed Artists.
- 📲**Import Playlist** via Text (Artist - Title) or CSV file or from local files
- 🎵**Audio Quality Selector** ability to switch between Low, High, Lossless, and Hi-Res audio qualities.
- 🟥**Accent Color** you can select that themes the player, sliders, and active elements.
- ⚙️**Additional Settings** like compact mode, square avatars, grayscale mode
- 📺**Support for low-end devices** like disable glow, reduced motion, high performance mode
- ❗️**More features coming soon**

## 🌐 Instances

| Version        | URL                         | Note                          |
|----------------|------------------------------|-------------------------------|
| **Official**     | https://spo.free.nf  | doesnt have ssl, but it just embeds spofree.vercel.app, hosted on infinityfree        |
| **Original**       | https://spofree.vercel.app | original domain, embedded by spo.free.nf |

## ⚙️ How It Works

SpoFree is a TIDAL frontend that fetches lossless audio for free without ads.

How it works:
1. You search for a song  
2. SpoFree sends the query to a HiFi API
3. The API returns a direct TIDAL lossless stream link  
4. SpoFree plays the audio

The API instances come from [open-source HiFi projects](https://github.com/EduardPrigoana/hifi-instances) that provide public endpoints.

## Screenshots

### Audio Quality Selector: 
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/audioquality.jpeg" width="50%"> 

### Color Selector: 
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/colors.jpeg" width="50%"> 

### Import Playlist Screen: 
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/import.jpeg" width="50%"> 

### Library: 
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/library.jpeg" width="50%">

### Liked Songs:
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/likedsongs.jpeg" width="50%">

### Extra Settings:
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/tweaks.jpeg" width="50%">

## 🤝 Contributing and Issues

Contributions are welcome. Feel free to open a Pull Request. Also please submit any bugs you find!

## 🔗 Related Projects

- https://github.com/uimaxbai/tidal-ui - Original Inspiration for this Project
- https://github.com/sachinsenal0x64/hifi - Tidal Music integration for Subsonic/Jellyfin/Plexamp
- https://github.com/uimaxbai/hifi-api - API that fetches the streams
- https://github.com/EduardPrigoana/hifi-instances - list of instances provided for the hifi API (dead)

## 🔎 API List

API:

| Provider      | Instance URL                                                       | Status                                                                                |
| ------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| squid.wtf     | [https://triton.squid.wtf](https://triton.squid.wtf)               | ![](https://img.shields.io/website?url=https://triton.squid.wtf\&label=status)        |
|               | [https://aether.squid.wtf](https://aether.squid.wtf)               | ![](https://img.shields.io/website?url=https://aether.squid.wtf\&label=status)        |
|               | [https://zeus.squid.wtf](https://zeus.squid.wtf)                   | ![](https://img.shields.io/website?url=https://zeus.squid.wtf\&label=status)          |
|               | [https://kraken.squid.wtf](https://kraken.squid.wtf)               | ![](https://img.shields.io/website?url=https://kraken.squid.wtf\&label=status)        |
|               | [https://phoenix.squid.wtf](https://phoenix.squid.wtf)             | ![](https://img.shields.io/website?url=https://phoenix.squid.wtf\&label=status)       |
|               | [https://shiva.squid.wtf](https://shiva.squid.wtf)                 | ![](https://img.shields.io/website?url=https://shiva.squid.wtf\&label=status)         |
|               | [https://chaos.squid.wtf](https://chaos.squid.wtf)                 | ![](https://img.shields.io/website?url=https://chaos.squid.wtf\&label=status)         |
| lucida (qqdl) | [https://wolf.qqdl.site](https://wolf.qqdl.site)                   | ![](https://img.shields.io/website?url=https://wolf.qqdl.site\&label=status)          |
|               | [https://maus.qqdl.site](https://maus.qqdl.site)                   | ![](https://img.shields.io/website?url=https://maus.qqdl.site\&label=status)          |
|               | [https://vogel.qqdl.site](https://vogel.qqdl.site)                 | ![](https://img.shields.io/website?url=https://vogel.qqdl.site\&label=status)         |
|               | [https://katze.qqdl.site](https://katze.qqdl.site)                 | ![](https://img.shields.io/website?url=https://katze.qqdl.site\&label=status)         |
|               | [https://hund.qqdl.site](https://hund.qqdl.site)                   | ![](https://img.shields.io/website?url=https://hund.qqdl.site\&label=status)          |

UI:

| Provider        | Instance URL                                                       | Status                                                                                                      |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| monochrome      | [https://monochrome.tf](https://monochrome.tf)                     | ![](https://img.shields.io/website?url=https://monochrome.tf\&label=status)                                 |
|                 | [https://monochrome.prigoana.com](https://monochrome.prigoana.com) | ![](https://img.shields.io/website?url=https://monochrome.prigoana.com\&label=status)                       |
| tidal-ui (bini) | [https://music.binimum.org/](https://music.binimum.org/)           | ![](https://img.shields.io/website?url=https://music.binimum.org/\&label=status)                            |
|                 | [https://tidal.squid.wtf](https://tidal.squid.wtf)                 | ![](https://img.shields.io/website?url=https://tidal.squid.wtf\&label=status)                               |
| Digger          | [https://digger-ui.vercel.app/](https://digger-ui.vercel.app/)     | ![](https://img.shields.io/website?url=https://digger-ui.vercel.app/\&label=status)                         |
| SpoFree         | [https://spo.free.nf/](https://spo.free.nf/)                       | ![](https://img.shields.io/website?url=https://spo.free.nf\&label=status\&up_message=up\&down_message=down) |

