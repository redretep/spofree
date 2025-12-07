# 🎶 SpoFree

SpoFree is a free, open-source, and ad-free music player with a massive catalogue and a clean interface similar to Spotify. No account, no login, no setup. Just open it and start listening.

## ✨ Features

- 🚫 **Ad-Free Listening** for uninterrupted playback  
- 🔊 **Lossless Audio** for high-fidelity sound  
- 🎵 **Huge Catalogue** powered by the full TIDAL library  
- 🖼️ **Clean, Familiar UI** similar to Spotify  
- ▶️ **Playlist Support** create and manage your own collections  
- 💾 **Local Storage** playlists saved via IndexDB in your browser  
- 🔎 **Advanced Search** find tracks, albums, artists, playlists  
- 🗄️ **Search Filters** sort by album, track, artist, or playlist  
- 📌 **More features coming soon**

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

## 🚀 Deployment

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
