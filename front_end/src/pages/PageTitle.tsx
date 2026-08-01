interface PageTitleProps {
    titulo: string;
    descricao: string;
}

export function PageTitle({ titulo, descricao }: PageTitleProps) {
    return (
        <section className="workspace-title">
            <div>
                <p>Monitoramento</p>
                <h1>{titulo}</h1>
                <span>{descricao}</span>
            </div>
        </section>
    );
}
