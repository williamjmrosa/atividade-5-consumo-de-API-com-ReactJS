import { useEffect, useState } from "react"
import "../css/all.css"

export default function Favoritos(){

    const [favoritos, setFavoritos] = useState([]);
    const [listaFilmes, setListaFilmes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [carregouFavoritos, setCarregouFavoritos] = useState(false);
    const [carregarDetalhes, setCarregarDetalhes] = useState(false);
    const [detalhes, setDetalhes] = useState({});
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if(carregouFavoritos === false) {
            console.log('carregou favoritos');
            const fav = localStorage.getItem("favoritos");
            setFavoritos(JSON.parse(fav) || []);
            setCarregouFavoritos(true);
        }
    }, []);

    useEffect(() => {
        carregarFavoritos();
    }, [favoritos]);

    const buscarFavoritos = async (idFavorito) => {
        try {
            const apiKey = import.meta.env.VITE_API_KEY;
            const response = await fetch(`https://api.themoviedb.org/3/movie/${idFavorito}?api_key=${apiKey}&language=pt-BR`)
            
            const data = await response.json()

            setCarregando(true)
            
            return data


        }catch (error) {
            console.log(error)
        }
    }

    const carregarFavoritos = async () => {
        setCarregando(true);

        const idsFavoritos = favoritos;

        if (idsFavoritos.length === 0) {
            setCarregando(false);
            setListaFilmes([]);
            return;
        }

        try {
            const listaPromises = idsFavoritos.map((idFavorito) => {
                return buscarFavoritos(idFavorito);
            });

            const lista = await Promise.all(listaPromises);

            
            setListaFilmes(lista); // Atualiza o resultado com a lista completa de filmes
            console.log('listaFilmes', listaFilmes)
            setCarregando(false); // Para de carregar após o sucesso
        } catch (error) {
            setCarregando(false); // Para de carregar em caso de erro
            console.error("Erro ao buscar favoritos:", error);
        }
    }

    function addRemoverFavorito(filme) {
        let fav = favoritos;
        if (!favoritos.find((id) => id === filme.id)) {
            fav.push(filme.id);
            console.log(favoritos);

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

    const fecharModalFora = (e) => {
        if (e.target.id === 'detalhes') {
            fecharDetalhes();
            console.log(e.target.id)
        }
    }

    function fecharDetalhes() {
        setCarregarDetalhes(false)
        setDetalhes({})
        const modal = document.getElementById('detalhes')
        modal.classList.remove('mostrar')
        //modal.removeEventListener('click', fecharModalFora)
    }

    const fechaMsg = (e) => {
        if (e.target.id === 'msg') {
            setMsg('')
        }
    }

    return (
        <div>
            <h1 className="titulo">FAVORITOS</h1>
            {
                msg && (
                    <div className="msg">
                        <p>{msg}</p>
                        <button className="btn-error" id="msg" onClick={fechaMsg}>X</button>
                    </div>
                )
            }

            {carregando && (
                console.log('carregando'),
                    <div className="carregando">
                        <p>Carregando...</p>
                    </div>
            )}

            <div id="resultado">
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