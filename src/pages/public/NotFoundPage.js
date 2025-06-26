import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function Error404() {
    return (
        <>
            <Helmet>
                <title>Página não encontrada - Coleta Seletiva</title>
                <meta name="description" content="Página não encontrada." />
            </Helmet>
            <main>
                <section className="info-section">
                    <div className="container">
                        <h2>Erro 404 - Página não encontrada</h2>
                        <p>A página que você está procurando não existe ou foi removida.</p>
                        <Link to="/">Voltar para a página inicial</Link>
                    </div>
                </section>
            </main>
        </>
    );
}

export default Error404;