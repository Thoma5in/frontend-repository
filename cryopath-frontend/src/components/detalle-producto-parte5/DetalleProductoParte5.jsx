import './DetalleProductoParte5.css'

const DetalleProductoParte5 = () =>{
    return(
        <section className="dp5">
            <div className="dp5__grid">
                <div className="dp5__left">
                    <h3 className="dp5__title">Opiniones del producto</h3>

                    <div className="dp5__ratingRow">
                        <div className="dp5__ratingValue">4.7</div>
                        <div className="dp5__stars" aria-label="Calificación 4.7 de 5">
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--half" />
                        </div>
                    </div>

                    <div className="dp5__subtitle">67 reseñas</div>

                    <div className="dp5__breakdown" role="list">
                        <div className="dp5__breakdownRow" role="listitem">
                            <div className="dp5__bar">
                                <div className="dp5__barFill" style={{ width: '78%' }} />
                            </div>
                            <div className="dp5__breakdownLabel">5</div>
                            <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                        </div>

                        <div className="dp5__breakdownRow" role="listitem">
                            <div className="dp5__bar">
                                <div className="dp5__barFill" style={{ width: '42%' }} />
                            </div>
                            <div className="dp5__breakdownLabel">4</div>
                            <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                        </div>

                        <div className="dp5__breakdownRow" role="listitem">
                            <div className="dp5__bar">
                                <div className="dp5__barFill" style={{ width: '18%' }} />
                            </div>
                            <div className="dp5__breakdownLabel">3</div>
                            <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                        </div>

                        <div className="dp5__breakdownRow" role="listitem">
                            <div className="dp5__bar">
                                <div className="dp5__barFill" style={{ width: '10%' }} />
                            </div>
                            <div className="dp5__breakdownLabel">2</div>
                            <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                        </div>

                        <div className="dp5__breakdownRow" role="listitem">
                            <div className="dp5__bar">
                                <div className="dp5__barFill" style={{ width: '6%' }} />
                            </div>
                            <div className="dp5__breakdownLabel">1</div>
                            <div className="dp5__breakdownIcon" aria-hidden="true">☆</div>
                        </div>
                    </div>
                </div>

                <div className="dp5__right">
                    <h3 className="dp5__title">Opiniones Destacadas</h3>

                    <article className="dp5__card">
                        <p className="dp5__cardText">
                            Excelente el tv. Todas las aplicaciones funcionan perfectamente y es super autonomo. El encendido,
                            los programas todo enciende casi que automático.
                        </p>

                        <div className="dp5__cardMeta">
                            <span className="dp5__metaPill">Es útil</span>
                            <button className="dp5__like" type="button">
                                <span className="dp5__likeIcon" aria-hidden="true">👍</span>
                                <span className="dp5__likeCount">12</span>
                            </button>
                        </div>

                        <div className="dp5__cardStars" aria-label="Calificación 5 de 5">
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                        </div>
                    </article>

                    <article className="dp5__card">
                        <p className="dp5__cardText">
                            Excelente el tv. Todas las aplicaciones funcionan perfectamente y es super autonomo. El encendido,
                            los programas todo enciende casi que automático.
                        </p>

                        <div className="dp5__cardMeta">
                            <span className="dp5__metaPill">Es útil</span>
                            <button className="dp5__like" type="button">
                                <span className="dp5__likeIcon" aria-hidden="true">👍</span>
                                <span className="dp5__likeCount">12</span>
                            </button>
                        </div>

                        <div className="dp5__cardStars" aria-label="Calificación 5 de 5">
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                            <span className="dp5__star dp5__star--full" />
                        </div>
                    </article>
                </div>
            </div>
        </section>
    )
}

export default DetalleProductoParte5