// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Track {
  //Статичне приватне поле для зберігання списук об'єктів Track
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генеруємо випадкове id
    this.name = name
    this.author = author
    this.image = image
  }

  //статичний метод для створення об'єкту Track і додавання його до списку #list
  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  //статичний метод для отриання всього списку треків
  static getList() {
    return this.#list.reverse()
  }

  // тут буде статичний метод getById
}
Track.create(
  'Інь Янь',
  'Monatic i ROXILANA',
  'https://picsum.photo/100/100',
)
Track.create(
  'Baila Conmigo (Remix)',
  'Selena Gomes i Rauw Alejandro',
  'https://picsum.photo/100/100',
)
Track.create(
  'Shameless',
  'Camila Cabello',
  'https://picsum.photo/100/100',
)
Track.create(
  'DAKITI',
  'BAD BUNNY i JHAY',
  'https://picsum.photo/100/100',
)
Track.create(
  '11 PM',
  'Maluma',
  'https://picsum.photo/100/100',
)
Track.create(
  'Інша любов',
  'Enleo',
  'https://picsum.photo/100/100',
)
console.log(Track.getList())

class Playlist {
  //статичне приватне поле для зберігання списку об'єктів Playlist
  static #list = []

  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 9000) //генеруємо випадкове id
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photo/100/100'
  }

  //статичний метод для створення об'єкту Playlist і додавання його до списку #list
  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  //статичний метод для отриамння всього списку плейлістів
  static getlist() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()
    let randomTracks = allTracks
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return (
      Playlist.#list.find(
        (playlist) => playlist.id === id,
      ) || null
    )
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter(
      (track) => track.id !== trackId,
    )
  }

  static findListByValue(name) {
    return this.#list.filter((playlist) =>
      playlist.name
        .toLowerCase()
        .includes(name.toLowerCase()),
    )
  }
  //тут буде метод addTrack
}
Playlist.makeMix(Playlist.create('Test1'))
Playlist.makeMix(Playlist.create('Test2'))
Playlist.makeMix(Playlist.create('Test3'))

//============================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/spotify-choose', function (req, res) {
  // res.render генерує нам HTML сторінку
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('spotify-choose', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'spotify-choose',
    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================
router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  console.log(isMix)
  res.render('spotify-create', {
    style: 'spotify-create',
    data: { isMix },
  })
})
// ==========================================================
router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  const name = req.body.name

  if (!name) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Введіть назву плейлиста',
        link: isMix
          ? `/spotify-create?isMix=true`
          : '/spotify-create',
      },
    })
  }

  //код який відповідає за створення плейлиста
  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  console.log(playlist)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)
  const playlist = Playlist.getById(id)
  if (!playlist) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/`,
      },
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  if (!playlist) {
    return res.render('purchase-alert', {
      style: 'purchase-alert',
      data: {
        message: 'Помилка',
        info: 'Такого плейлиста не знайдено',
        link: `/spotify-playlist?id=${playlistId}`,
      },
    })
  }
  playlist.deletetrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})
//=======================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)
  console.log(value)

  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: tracks.length,
      })),
      value,
    },
  })
})
//========================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      //  playlistId: playlist.id,
      //  tracks: Track.getList(),
      //  name: playlist.name,
    },
  })
  // ↑↑ сюди вводимо JSON дані
})
//========================================================

// Підключаємо роутер до бек-енду
module.exports = router
