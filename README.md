### I will not continue to update this project. Feel free to fork the project, add features or fix bugs if you want to.

---

# 🎶 SpoFree
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fredretep%2Fspofree%2F)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/redretep/spofree)

SpoFree is a free, open-source, and ad-free music player based on Tidal with Hi-Res sound. It has a clean interface similar to Spotify.
<img src="https://raw.githubusercontent.com/redretep/spofree/ae27a51a154f159ff419b094830b916c00a6a4a2/images/album.jpeg" width="100%">

## Features

- ❌**Ad-Free Listening**
- 💿**Lossless Audio**
- 🎧**Huge Catalogue** powered by the full TIDAL library
- 🔲**Clean UI** similar to Spotify
- 🎶**Playlist Support**
- 📁**Local Storage** playlists, liked songs, recently listened saved via IndexDB in your browser
- 🔎**Search**
- 💾**Export** audio as csv or zip containing lossless .flac files
- ⏰**Sleep Timer** with customizable length
- 🔢**Queue** that you can save as a playlist and customize
- 🎵**Media Session API** for lock screen and control center support
- 📶**Library** Organized library with Playlists, Liked Songs, Saved Albums, and Followed Artists.
- 🎵**Audio Quality Selector**
- 🟥**Accent Color**
- ⚙️**Additional Settings**
- 📺**Settings for low-end devices**
- 📲**Import Playlist** via Text (Artist - Title) or CSV file or from local files
- 📥**Import Spotify Playlists** using [this website](https://redretep.github.io/spofree-playlists/), [this](https://github.com/redretep/spofree-playlists) is the repo
- ❗️**More features coming soon**

## 🌐 Instances / Wrapper

| Version        | URL                         | Note                          |
|----------------|------------------------------|-------------------------------|
| **Official**     | https://spo.free.nf  | doesnt have ssl, but it just embeds spofree.vercel.app, hosted on infinityfree        |
| **Original**       | https://spofree.vercel.app | original domain, embedded by spo.free.nf |
| **Unofficial**       | https://github.com/eweerfr/spofree-electron | Electron wrapper for windows by [eweer](https://github.com/eweerfr). Thank you for contributing! |

## ⚙️ How It Works

SpoFree acts as a Frontend that fetches lossless audio directly from TIDAL.

How it works:
1. You search for a song  
2. SpoFree sends the query to a HiFi API
3. The API returns a direct TIDAL lossless stream link  
4. SpoFree plays the audio

The API instances come from [open-source HiFi projects](https://github.com/EduardPrigoana/hifi-instances) that provide public endpoints.

## 🤝 Contributing and Issues

Contributions are welcome. Feel free to open a Pull Request. Also please submit any bugs you find!

## 🔗 Related Projects

- https://github.com/uimaxbai/tidal-ui - Original Inspiration for this Project
- https://github.com/sachinsenal0x64/hifi - Tidal Music integration for Subsonic/Jellyfin/Plexamp
- https://github.com/uimaxbai/hifi-api - API that fetches the streams
- https://github.com/monochrome-music/monochrome - alternative free tidal music player that uses the same API
- https://github.com/EduardPrigoana/hifi-instances - list of instances provided for the hifi API
- https://github.com/eweerfr/spofree-electron - Electron Wrapper of the site for windows
  
## Screenshots

### Audio Quality Selector and Appereance
<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/audioquality.jpeg" width="100%"></td>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/colors.jpeg" width="100%"></td>
  </tr>
</table>

### Playlist Import and Library
<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/import.jpeg" width="100%"></td>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/library.jpeg" width="100%"></td>
  </tr>
</table>

### Liked Songs and Extra Settings
<table>
  <tr>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/likedsongs.jpeg" width="100%"></td>
    <td><img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/tweaks.jpeg" width="100%"></td>
  </tr>
</table>


