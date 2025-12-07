# 🎶 SpoFree

SpoFree ist ein kostenloser und komplett werbefreier Musikplayer mit großem Katalog und einem cleanen Interface das an Spotify erinnert. Du brauchst keinen Account und keine Daten. Einfach öffnen und hören.

## ✨ Features

- 🚫 **Keine Werbung** für entspanntes Hören
- 🔊 **Lossless Playback** für richtig gute Soundqualität
- 🎵 **Riesiger Katalog** dank kompletter TIDAL Library
- 🖼️ **Bekanntes UI** ähnlich wie Spotify
- ▶️ **Playlists** selbst erstellen und verwalten
- 💾 **Lokale Speicherung** über IndexDB direkt im Browser
- 🔎 **Starke Suche** nach Songs, Alben, Artists oder Playlists
- 🗄️ **Filter** um Ergebnisse schnell zu sortieren  
- 📌 **Mehr Features kommen noch**

## 🌐 Live Versionen

| Version          | URL                          | Hinweis                     |
|------------------|-------------------------------|-----------------------------|
| **Stable**       | spofree.netlify.app           | Empfohlen für normalen Use |
| **Beta**         | spofree-beta.netlify.app      | Neue Features, evtl buggy  |

## ⚙️ Wie es funktioniert

SpoFree ist ein Client der Lossless Audio direkt aus dem TIDAL Katalog holt.  
Dafür nutzt es HiFi APIs welche aus offenen Projekten stammen.

Ablauf kurz erklärt:
1. du suchst nach einem Song  
2. SpoFree fragt die API  
3. die API gibt den direkten TIDAL Lossless Stream zurück  
4. SpoFree spielt den Stream ab

## 🚀 Deployment

Du kannst SpoFree easy selbst hosten, zum Beispiel auf **Netlify** oder **Vercel**, komplett kostenlos.

## 🤝 Contribution

Mitmachen ist willkommen. Einfach ein Pull Request öffnen.

## 🔗 Related Projects

- uimaxbai/tidal-ui  
- sachinsenal0x64/hifi  
- uimaxbai/hifi-api  
- monochrome-music/monochrome  
- EduardPrigoana/hifi-instances
