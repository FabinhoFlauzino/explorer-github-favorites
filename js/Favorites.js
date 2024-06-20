export class GithubUser {
  static search(userName) {
    const endpoint = `https://api.github.com/users/${userName}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}

//classe que vai conter a lógica dos dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  delete(user) {
    const filteredEntries = this.entries.filter((entry) => {
      return entry.login !== user.login
    })

    this.entries = filteredEntries
    this.update()
  }
}

//classe vai criar a visualização e os eventos
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector("table tbody")
    this.update()
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Deseja mesmo excluir?")

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/FabinhoFlauzino.png" alt="Imagem de Fabio Flauzino">
        <a href="https://github.com/FabinhoFlauzino" target="_blank">
          <p>Fabio Flauzino</p>
          <span>FabinhoFlauzino</span>
        </a>
      </td>

      <td class="repositories">
        76
      </td>

      <td class="followers">
        1000
      </td>

      <td>
        <button class="remove">&times;</button>
      </td> 
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr")
      .forEach((tr) => {
        tr.remove()
      })
  }
}