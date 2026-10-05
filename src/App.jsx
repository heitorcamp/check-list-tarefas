import { useState } from 'react';

// Edite esta lista para trocar, adicionar ou remover perguntas.
const QUESTIONS = [
  'Você acordou antes das 13:00?',
  'Você fez bike hoje? (um pouquinho já vale!)',
  'Você separou um tempo para estudar?',
  'Você comprou mais brusinha?(não minta!)',
  'Você já bebeu sua meta de água hoje?',
  'Hoje é um dos 3 dias do mês que você não esta de TPM?', 
  'Você já humilhou alguém hoje? (se for a Arlete vale ponto)',
  'Já fez algo hoje que te deixou orgulhosa de você mesma?',
];

const REACTIONS = {
  high: [
    { emoji: '🏆', title: 'Ta vooando!', message: 'Você foi  muito bem! (espero que seja verdade)' },
    { emoji: '🚀', title: 'Já parece outra pessoa!', message: 'Seu pouco esforço está fazendo a diferença.' },
    { emoji: '✨', title: 'Dia de gloria chegou!', message: 'Continue assim, você merece uma bala.' },
  ],
  middle: [
    { emoji: '🙂', title: 'Melhor que nada né!', message: 'Cada passo conta, e seu dedão deixa o passo ainda maior =P.' },
    { emoji: '🌱', title: 'Você está menos pior!', message: 'Um pouco de cada vez também é progresso.' },
    { emoji: '👏', title: 'Pooh mocoronga!! Tudo bem!', message: 'Nem todo dia sai como planejado. Amanhã você consegue... ou não.' },
  ],
  low: [
    { emoji: '🥲', title: 'Valeu o esforço minimo!', message: 'Amanhã é uma nova oportunidade para melhorar.' },
    { emoji: '🌤️', title: 'Persista.', message: 'Não porque vai dar certo, mas porque parar agora também não vai melhorar nada.' },
    { emoji: '🧭', title: 'Ajuste esse relogio', message: 'Pequenos passos podem mudar o seu dia, mas ficar parada não.' },
  ],
};

function getReaction(score) {
  const group = score >= 3 ? REACTIONS.high : score >= 0 ? REACTIONS.middle : REACTIONS.low;
  return group[Math.floor(Math.random() * group.length)];
}

export default function App() {
  const [name, setName] = useState('');
  const [screen, setScreen] = useState('welcome');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [reaction, setReaction] = useState(null);

  const startChecklist = (event) => {
    event?.preventDefault();
    if (!name.trim()) return;
    setScore(0);
    setQuestionIndex(0);
    setScreen(QUESTIONS.length ? 'questions' : 'result');
    if (!QUESTIONS.length) setReaction(getReaction(0));
  };

  function answer(value) {
    const nextScore = score + value;
    setScore(nextScore);
    if (questionIndex + 1 < QUESTIONS.length) {
      setQuestionIndex(questionIndex + 1);
      return;
    }
    setReaction(getReaction(nextScore));
    setScreen('result');
  }

  function restart() {
    setName('');
    setScore(0);
    setQuestionIndex(0);
    setReaction(null);
    setScreen('welcome');
  }

  const progress = QUESTIONS.length ? ((questionIndex + 1) / QUESTIONS.length) * 100 : 100;

  return (
    <main className="page-shell">
      <div className="app-card">
        <header className="topline">
          <div className="brand-mark" aria-hidden="true">✓</div>
          <span className="brand">MEU DIA</span>
          {screen === 'questions' ? (
            <span className="step-label">{questionIndex + 1} / {QUESTIONS.length}</span>
          ) : <span className="step-spacer" />}
        </header>

        <section className="main-content" aria-live="polite">
          {screen === 'welcome' && (
            <>
              <div className="illustration" aria-hidden="true">☀️</div>
              <p className="eyebrow">AGORA A PERTUBAÇÃO SUBIU DE NIVEL HAHA</p>
              <h1>Como quer ser<br />chamada hoje?</h1>
              <p className="description">Responda algumas perguntas sobre o seu dia, e sem mentir, o morrinho vai crescer 👃🏻.</p>
              <form onSubmit={startChecklist}>
                <label className="input-label" htmlFor="person-name">SEU NOME</label>
                <input
                  id="person-name"
                  className="name-input"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Digite seu nome"
                  maxLength={40}
                  autoComplete="given-name"
                />
                <button className="primary-button" type="submit" disabled={!name.trim()}>
                  <span>Começar</span><span className="button-arrow" aria-hidden="true">→</span>
                </button>
              </form>
            </>
          )}

          {screen === 'questions' && (
            <>
              <div className="progress-track" role="progressbar" aria-label="Progresso das perguntas" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
                <span className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="eyebrow question-eyebrow">PERGUNTA {questionIndex + 1}</p>
              <h1 className="question-heading">E aí, {name.trim()}?</h1>
              <div className="question-card"><p>{QUESTIONS[questionIndex]}</p></div>
              <p className="helper">Cada resposta soma ou tira 1 ponto.</p>
              <div className="answer-group">
                <button className="answer-button yes-button" onClick={() => answer(1)}>
                  <span>Acertei </span><small>+1 ponto</small>
                </button>
                <button className="answer-button no-button" onClick={() => answer(-1)}>
                  <span>Falhei</span><small>−1 ponto</small>
                </button>
              </div>
            </>
          )}

          {screen === 'result' && reaction && (
            <>
              <div className="result-badge" aria-hidden="true">{reaction.emoji}</div>
              <p className="eyebrow">SEU RESULTADO</p>
              <h1>Mandou bem em responder,<br />{name.trim()}!</h1>
              <div className="score-card">
                <span className="score-label">SUA PONTUAÇÃO</span>
                <strong className="score-value">{score > 0 ? `+${score}` : score}</strong>
                <span className="score-unit">{Math.abs(score) === 1 ? 'ponto' : 'pontos'}</span>
              </div>
              <h2 className="reaction-title">{reaction.title}</h2>
              <p className="description result-description">{reaction.message}</p>
              <button className="primary-button" onClick={restart}>
                <span>Fazer de novo</span><span className="button-arrow" aria-hidden="true">→</span>
              </button>
            </>
          )}
        </section>
        <footer className="footer">UM PASSO DE CADA VEZ</footer>
      </div>
    </main>
  );
}
