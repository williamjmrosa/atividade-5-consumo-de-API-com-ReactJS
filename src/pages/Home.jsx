import { useEffect, useState } from "react"
import "../css/all.css"

export default function Home(){

    const [inputBusca, setInputBusca] = useState('');
    const [busca, setBusca] = useState('');
    const [listaFilmes, setListaFilmes] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [error, setError] = useState(null);
    const [msg, setMsg] = useState('');
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [carregarDetalhes, setCarregarDetalhes] = useState(false);
    const [detalhes, setDetalhes] = useState({});
    const [carregouFavoritos, setCarregouFavoritos] = useState(false);

    useEffect(() => {
        if(carregouFavoritos === false) {
            const favoritos = localStorage.getItem("favoritos");
            setFavoritos(JSON.parse(favoritos) || []);
            setCarregouFavoritos(true);
            setBusca('');
            buscarFilme();
        }
    }, []);

    useEffect(() => {
      
        buscarFilme();
       
    },[busca]);

    useEffect(() => {
        setCarregando(true)
        buscarFilme();
    },[pagina]);
    
    const buscarFilme = async () => {
        try {

            const apiKey = import.meta.env.VITE_API_KEY;

            let URL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${busca}&page=${pagina}`;
            if(busca === '') {
                URL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=${pagina}`;
            }

            const response = await fetch(URL);

            const data = await response.json();
            setListaFilmes(data.results);
            setTotalPaginas(data.total_pages > 500 ? 500 : data.total_pages);

            setCarregando(false);
        } catch (error) {
            console.log(error);
        }
    }

    const btnBuscar = (event) => {
        setCarregando(true);
        event.preventDefault();
        setPagina(1);
        setTotalPaginas(1);
        setBusca(inputBusca);
    }

    const fecharModalFora = (e) => {
        if (e.target.id === 'detalhes') {
            fecharDetalhes();
        }
    }

    function fecharDetalhes() {
        setCarregarDetalhes(false)
        setDetalhes({})
        const modal = document.getElementById('detalhes')
        modal.classList.remove('mostrar')
        //modal.removeEventListener('click', fecharModalFora)
    }
    
    function addRemoverFavorito(filme) {
        let fav = favoritos;
        if (!favoritos.find((id) => id === filme.id)) {
            fav.push(filme.id);

            setMsg(`Filme ${filme.title} adicionado aos favoritos`);
            setTimeout(() => {
                setMsg('');
            }, 3000);

        } else {
            fav = favoritos.filter( (id) => id !== filme.id);
            
            setMsg('Filme removido dos favoritos');
            setTimeout(() => {
                setMsg('');
            }, 3000);
        }

        setFavoritos(fav);
        localStorage.setItem("favoritos", JSON.stringify(fav));
    }

    const mostrarDetalhes = async (filme) => {

        try {
            
            setDetalhes({})

            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/movie/${filme.id}/credits?api_key=${apiKey}&language=pt-BR`)
            
            const data = await response.json()
            
            filme.credits = data

            setDetalhes(filme)
            setCarregarDetalhes(false)

            const modal = document.getElementById('detalhes')
            modal.classList.add('mostrar')

            modal.addEventListener('click', fecharModalFora);
            

        }catch (error) {
            console.log(error)
        }
    }

    const mostrarPaginas = () => {
        let paginas = []
        if(totalPaginas > 25 && pagina > 10) {
            paginas.push(<button key={1} onClick={() => setPagina(1)}>1</button>);
            paginas.push(<p className="mais">...</p>)
            for(let i = pagina - 5; i <= (pagina + 5 > totalPaginas ? totalPaginas : pagina + 5); i++) {
                if (i == pagina) {
                    paginas.push(<button className="selecionado" key={i} onClick={() => setPagina(i)}>{i}</button>)
                }else {
                    paginas.push(<button key={i} onClick={() => setPagina(i)}>{i}</button>)
                }
            }
            if(totalPaginas > (pagina + 5)){
                paginas.push(<p className="mais">...</p>)             
                paginas.push(<button key={totalPaginas} onClick={() => setPagina(totalPaginas)}>{totalPaginas}</button>)
            }
        }else if(totalPaginas > 25 && pagina <= 10) {
            for(let i = 1; i <= 10; i++) {
                if (i == pagina) {
                    paginas.push(<button className="selecionado" key={i} onClick={() => setPagina(i)}>{i}</button>)
                }else {
                    paginas.push(<button key={i} onClick={() => setPagina(i)}>{i}</button>)
                }
            }
            paginas.push(<p className="mais">...</p>)
            paginas.push(<button key={totalPaginas} onClick={() => setPagina(totalPaginas)}>{totalPaginas}</button>)
        }else {
            for(let i = 1; i <= totalPaginas; i++) {
                if (i == pagina) {
                    paginas.push(<button className="selecionado" key={i} onClick={() => setPagina(i)}>{i}</button>)
                }else {
                    paginas.push(<button key={i} onClick={() => setPagina(i)}>{i}</button>)
                }
            }
        }

        return paginas
    }

    const fechaErro = (e) => {
        if (e.target.id === 'error') {
            setError('')
        }
    }

    const fechaMsg = (e) => {
        if (e.target.id === 'msg') {
            setMsg('')
        }
    }

    return (
        <div>
            <form onSubmit={btnBuscar}>
                <input type="text" id="filme" placeholder="Digite o filme" value={inputBusca} onChange={(e) => setInputBusca(e.target.value)}/>
                <button type="submit">Buscar</button>
            </form>
            <div>
                {
                    totalPaginas > 1 && (
                        <div className="paginacao">
                            <button disabled={pagina == 1} onClick={() => setPagina( pagina == 1 ? 1 : pagina - 1)}>Anterior</button>

                            {mostrarPaginas()}

                            <button disabled={pagina == totalPaginas} onClick={() => setPagina( pagina == totalPaginas ? totalPaginas : pagina + 1)}>Próximo</button>
                        </div>
                    )
                }
            </div>
            {msg && (
                <div className="msg">
                    <p>{msg}</p>
                    <button className="btn-error" id="msg" onClick={fechaMsg}>X</button>
                </div>
                )}

            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button className="btn-error" id="error" onClick={fechaErro}>X</button>
                </div>
                )}

            <div id="resultado">
                {carregando && (
                    <div className="carregando">
                        <p>Carregando...</p>
                    </div>
                )}

                {
                    listaFilmes.map((filme) => {
                        return (
                            <div className="card" key={filme.id}>
                                {filme.poster_path ? <img src={`https://image.tmdb.org/t/p/w500/${filme.poster_path}`} alt={filme.title} /> : <img src={"/semImagem.svg"} alt={filme.title} />
                                }
                                <h2>{filme.title}</h2>
                                <p>Data de lancamento: {filme.release_date}</p>
                                <p>Nota: {filme.vote_average}</p>
                                <button onClick={() => {
                                    setCarregarDetalhes(true)
                                    mostrarDetalhes(filme)
                                }
                                }>Detalhes</button>
                                <button className="favoritar" onClick={() => {
                                    addRemoverFavorito(filme)
                                    
                                    const novoReultado = listaFilmes
                                    setListaFilmes(novoReultado)
                                    
                                }

                                }>{favoritos.find((id) => id === filme.id) ? 'Desfavoritar' : 'Favoritar'}</button>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                {
                    totalPaginas > 1 && (
                        <div className="paginacao">
                            <button disabled={pagina == 1} onClick={() => setPagina( pagina == 1 ? 1 : pagina - 1)}>Anterior</button>

                            {mostrarPaginas()}

                            <button disabled={pagina == totalPaginas} onClick={() => setPagina( pagina == totalPaginas ? totalPaginas : pagina + 1)}>Próximo</button>
                        </div>
                    )
                }
            </div>
            <div id="detalhes">
                {
                    carregarDetalhes && (
                    <p>Carregando...</p>
                )}
                {
                    Object.keys(detalhes).length > 0 && (
                        <div className="detalhes">
                            <div className="cabecalho">
                                <button onClick={fecharDetalhes}>X</button>
                                <h1>Detalhes</h1>
                            </div>
                            
                            <div className="filme">
                                <img src={`https://image.tmdb.org/t/p/w500/${detalhes.poster_path}`} alt={detalhes.title} />
                                <div className="info">
                                    <h2>{detalhes.title}</h2>
                                    <h2>Sinopse</h2>
                                    <p>{detalhes.overview}</p>
                                <p>Data de lancamento: {detalhes.release_date}</p>
                                <p>Nota: {detalhes.vote_average}</p>
                                </div>
                            </div>
                            <div style={{textAlign: "left"}}>
                                <h4>Diretor: {detalhes.credits.crew.find((personagem) => personagem.job == 'Director').name}</h4>
                                <h2>Elenco</h2> 
                                <div className="elenco">
                                {
                                    detalhes.credits.cast.map((ator, index) => {
                                                                                
                                        if (index < 10) return (
                                            <div key={ator.id}>
                                                <img src={`https://image.tmdb.org/t/p/w500/${ator.profile_path}`} alt={ator.name} />
                                                <p>{ator.name}</p>
                                                <p>{ator.character}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            
                        </div>
                    )
                }
            </div>
        </div>
    )
}