import { Link } from "react-router-dom"
import "./Home.css"

function Home() {
  return (
    <section className="home">
        <h1 className="title">Página inicial</h1>

        <div className="actions">
            <Link to="/polls"><button className="btn">Visualizar enquetes</button></Link>
            <Link to="/polls/new"><button className="btn">Criar enquete</button></Link>
        </div>
    </section>
  )
}

export default Home
