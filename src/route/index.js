// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => this.#list

  static getById = (id) => {
    this.#list.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000 // Генеруємо випадкове 5-значне число
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList = () => this.#list

  static add = (product) => {
    this.#list.push(product)
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static updateById = (id, data) => {
    const product = this.getById(id)
    if (product) {
      if (data.name) product.name = data.name
      if (data.price) product.price = data.price
      if (data.description)
        product.description = data.description
      return true
    }
    return false
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    }
    return false
  }
}

// ============================================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/user-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, login, password } = req.body
  const user = new User(email, login, password)
  User.add(user)
  console.log(User.getList())
  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувач створений',
  })
  // ↑↑ сюди вводимо JSON дані
})
// ================================================================

router.get('/user-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query
  User.deleteById(Number(id))

  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: 'Користувач видалений',
  })

  // ↑↑ сюди вводимо JSON дані
})
// ==========================================================
router.post('/user-update', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, password, id } = req.body
  let result = false
  const user = User.getById(Number(id))

  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true
  }

  res.render('success-info', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'success-info',
    info: result ? 'Пошта оновлена' : 'Сталася помилка',
  })

  // ↑↑ сюди вводимо JSON дані
})
// ==========================================================
router.get('/product-list', function (req, res) {
  const products = Product.getList()
  console.log(list)

  res.render('product-list', {
    style: 'product-list',
    data: {
      products: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})
// GET endpoint для сторінки створення товару

router.get('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('product-create', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'product-create',
  })
  // ↑↑ сюди вводимо JSON дані
})
//

// POST endpoint для створення товару
router.post('/product-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { name, price, description } = req.body
  const product = new Product(name, price, description)
  Product.add(product)
  console.log(Product.getList())
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert',
    info: 'Товар успішно додано',
  })
  // ↑↑ сюди вводимо JSON дані
})
// GET endpoint для сторінки редагування товару
router.get('/product-edit', (req, res) => {
  const productId = req.query.id
  const product = Product.getById(Number(productId))
  if (!product) {
    // Якщо товар з таким ID не знайдено, показуємо повідомлення
    res.render('alert', {
      title: 'Alert',
      message: 'Товар з таким ID не знайдено',
      buttonLabel: 'Повернутися назад',
    })
  } else {
    res.render('product-edit', { product })
  }
})

// POST endpoint для оновлення товару
router.post('/product-edit', (req, res) => {
  const { id, name, price, description } = req.body
  const updatedData = { name, price, description }
  const success = Product.updateById(
    Number(id),
    updatedData,
  )
  if (success) {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар успішно оновлено!',
      buttonLabel: 'Повернутися назад',
    })
  } else {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар з таким ID не знайдено',
      buttonLabel: 'Повернутися назад',
    })
  }
})
// GET endpoint для сторінки видалення товару
router.get('/product-delete', (req, res) => {
  const productId = req.query.id
  const product = Product.getById(Number(productId))
  const success = Product.deleteById(Number(id))
  if (success) {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар успішно видалено!',
      buttonLabel: 'Повернутися назад',
    })
  } else {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар з таким ID не знайдено',
      buttonLabel: 'Повернутися назад',
    })
  }
})

// POST endpoint для видалення товару
router.post('/product-delete', (req, res) => {
  const { id } = req.body
  const success = Product.deleteById(Number(id))
  if (success) {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар успішно видалено!',
      buttonLabel: 'Повернутися назад',
    })
  } else {
    res.render('alert', {
      title: 'Alert',
      message: 'Товар з таким ID не знайдено',
      buttonLabel: 'Повернутися назад',
    })
  }
})

// GET ендпоінт для сторінки /container/alert
router.get('/alert', function (req, res) {
  res.render('alert', {
    title: 'Alert',
  })
})
// ==========================================================

// Підключаємо роутер до бек-енду
module.exports = router
