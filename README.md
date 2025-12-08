# 🎶 SpoFree
<img src="https://raw.githubusercontent.com/redretep/spofree/eaa74dbda39aea0470a7f388436c094ce61b990a/images/home.jpeg" width="100%">
SpoFree is a free, open-source, and ad-free music player with a massive catalogue and a clean interface similar to Spotify. No account, no login, no setup. Just open it and start listening.

## Features

- **Ad-Free Listening** from Tidal
- **Lossless Audio** for hifi sound
- **Huge Catalogue** powered by the full TIDAL library and HiFi APIs
- **Clean UI** similar to Spotify
- **Playlist Support** create and import your own Playlists
- **Local Storage** playlists, liked songs, recently listened saved via IndexDB in your browser
- **Advanced Search** find tracks, albums, artists, playlists
- **Search Filters** sort by album, track, artist, or playlist
- **Export** songs, playlists, albums and liked songs as csv or zip
- **Sleep Timer** with customizable length
- **Queue** that you can save as a playlist and customize
- **Media Session API** for lock screen and control center support
- **Library Tabs** Organized library with Playlists, Liked Songs, Saved Albums, and Followed Artists.
- **Import Playlist** via Modal to import playlists via Text (Artist - Title) or CSV file.
- **Audio Quality Selector** ability to switch between Low, High, Lossless, and Hi-Res audio qualities.
- **Accent Color** you can select that themes the player, sliders, and active elements.
- **More features coming soon**
- **Additional Settings** like compact mode, square avatars, grayscale mode
- **Support for low-end devices** like disable glow, reduced motion, high performance mode

## 🌐 Live Versions

| Version        | URL                         | Note                          |
|----------------|------------------------------|-------------------------------|
| **Stable**     | https://spo.free.nf  | Recommended version           |
| **Beta**       | https://spofree-beta.netlify.app | New features, may be buggy |

## ⚙️ How It Works

SpoFree acts as a client that fetches lossless audio directly from TIDAL’s catalogue.

How it works:
1. You search for a song  
2. SpoFree sends the query to a HiFi API  
3. The API returns a direct TIDAL lossless stream link  
4. SpoFree plays the audio instantly

The API instances come from open-source HiFi projects that provide public endpoints.

## Screenshots
### Album View:
<img src="https://raw.githubusercontent.com/redretep/spofree/ae27a51a154f159ff419b094830b916c00a6a4a2/images/album.jpeg" width="50%"> 

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

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fredretep%2Fspofree%2F)

You can deploy your own SpoFree instance for free on services like **Netlify** or **Vercel**.  
Clone the repo, upload, done.

## 🤝 Contributing and Issues

Contributions are welcome. Feel free to open a Pull Request. Also please submit any bugs you find!

## 🔗 Related Projects

- https://github.com/uimaxbai/tidal-ui  
- https://github.com/sachinsenal0x64/hifi  
- https://github.com/uimaxbai/hifi-api  
- https://github.com/monochrome-music/monochrome  
- https://github.com/EduardPrigoana/hifi-instances
