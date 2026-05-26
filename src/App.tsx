import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { HashRouter, Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import type {
  AppState,
  DailyPlan,
  ExcuseType,
  FocusSessionResult,
  GaveExcuseLevel,
  HandicapLog,
  NightlyReview,
  TriggerType,
} from "./types";
import { addFocusSession, addHandicapLog, dateKeyFromIso, loadState, newId, todayKey, upsertDailyPlan, upsertNightlyReview } from "./storage";

const triggerLabels: Record<TriggerType, string> = {
  smartphone: "スマホ",
  youtube: "YouTube",
  sns: "SNS",
  game: "ゲーム",
  sleep_delay: "夜更かし",
  cleaning: "片付け",
  research: "情報収集",
  other_task: "別タスク",
  food: "食事・間食",
  other: "その他",
};

const excuseLabels: Record<ExcuseType, string> = {
  tired: "疲れている",
  sleepy: "眠い",
  no_time: "時間がない",
  not_ready: "準備不足",
  better_method: "もっと良いやり方を探したい",
  fear_failure: "失敗したくない",
  low_motivation: "やる気がない",
  unclear: "何をすればいいか曖昧",
  other: "その他",
};

const resultLabels: Record<FocusSessionResult, string> = {
  completed: "やった",
  escaped: "途中で逃げた",
  not_started: "始められなかった",
};

const gaveExcuseLabels: Record<GaveExcuseLevel, string> = {
  none: "渡していない",
  little: "少し渡した",
  yes: "渡した",
};

type TimerDraft = {
  startedAt: string;
  secondsLeft: number;
  openResult: boolean;
};

export function App() {
  const [state, setState] = useState<AppState>(() => loadState());

  return (
    <HashRouter>
      <main className="appShell">
        <header className="topHeader">
          <p className="eyebrow">{formatJapaneseDate(todayKey())}</p>
          <h1>戻るボタン</h1>
          <p className="lead">今日の自分が、明日の自分に言い訳を渡さないための小さな記録。</p>
        </header>

        <Routes>
          <Route path="/" element={<TodayPage state={state} onStateChange={setState} />} />
          <Route path="/logs" element={<LogsPage state={state} />} />
          <Route path="/review" element={<ReviewPage state={state} />} />
        </Routes>

        <BottomNav />
      </main>
    </HashRouter>
  );
}

function BottomNav() {
  return (
    <nav className="bottomNav" aria-label="主な画面">
      <NavLink to="/" end>
        今日
      </NavLink>
      <NavLink to="/logs">記録</NavLink>
      <NavLink to="/review">振り返り</NavLink>
    </nav>
  );
}

function TodayPage({ state, onStateChange }: { state: AppState; onStateChange: (state: AppState) => void }) {
  const navigate = useNavigate();
  const today = todayKey();
  const plan = getPlanForDate(state, today);
  const [isEditingPlan, setIsEditingPlan] = useState(!plan);
  const [showEscape, setShowEscape] = useState(false);
  const [showNight, setShowNight] = useState(false);
  const [timer, setTimer] = useState<TimerDraft | null>(null);

  useEffect(() => {
    if (!timer || timer.openResult) return;
    const id = window.setInterval(() => {
      setTimer((current) => {
        if (!current || current.openResult) return current;
        if (current.secondsLeft <= 1) return { ...current, secondsLeft: 0, openResult: true };
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timer]);

  function startTimer() {
    setTimer({ startedAt: new Date().toISOString(), secondsLeft: 15 * 60, openResult: false });
  }

  function saveSession(result: FocusSessionResult, memo: string) {
    if (!plan) return;
    const now = new Date().toISOString();
    onStateChange(
      addFocusSession(state, {
        id: newId("focus"),
        dailyPlanId: plan.id,
        startedAt: timer?.startedAt ?? now,
        endedAt: now,
        durationMinutes: 15,
        result,
        memo: memo.trim() || undefined,
        createdAt: now,
      }),
    );
    setTimer(null);
    navigate("/logs");
  }

  function saveEscape(input: EscapeInput) {
    const now = new Date().toISOString();
    const targetPlan = plan ?? createBlankPlan(today);
    const next = addHandicapLog(state, {
      id: newId("handicap"),
      dailyPlanId: targetPlan.id,
      triggerType: input.triggerType,
      excuseType: input.excuseType,
      note: input.note.trim() || undefined,
      returnedToTask: input.returnedToTask,
      createdAt: now,
    });
    onStateChange(next);
    setShowEscape(false);
    if (input.returnedToTask) {
      startTimer();
    } else {
      navigate("/logs");
    }
  }

  return (
    <section className="screen">
      {isEditingPlan || !plan ? (
        <DailyPlanForm
          plan={plan}
          today={today}
          onCancel={plan ? () => setIsEditingPlan(false) : undefined}
          onSave={(nextPlan) => {
            onStateChange(upsertDailyPlan(state, nextPlan));
            setIsEditingPlan(false);
          }}
        />
      ) : (
        <section className="planPanel">
          <div className="planHeader">
            <div>
              <p className="eyebrow">今日の一番大事なこと</p>
              <h2>{plan.mainTask}</h2>
            </div>
            <button type="button" onClick={() => setIsEditingPlan(true)}>
              編集
            </button>
          </div>
          <InfoBlock label="最初の15分でやること" value={plan.firstAction} />
          <InfoBlock label="今日渡したくない言い訳" value={plan.avoidExcuse} />
        </section>
      )}

      <section className="actionBand">
        <button className="primaryButton" type="button" onClick={startTimer} disabled={!plan}>
          15分やる
        </button>
        <button className="dangerButton" type="button" onClick={() => setShowEscape(true)}>
          逃げそう
        </button>
        <button type="button" onClick={() => setShowNight(true)}>
          夜のチェック
        </button>
      </section>

      <section className="quietPanel">
        <p>本当に休息が必要なら休む。逃げなら15分だけ戻る。</p>
      </section>

      {timer && <TimerPanel plan={plan} timer={timer} onInterrupt={() => setTimer((current) => (current ? { ...current, openResult: true } : current))} onFinish={() => setTimer((current) => (current ? { ...current, secondsLeft: 0, openResult: true } : current))} onSave={saveSession} />}
      {showEscape && <EscapePanel onClose={() => setShowEscape(false)} onSave={saveEscape} />}
      {showNight && (
        <NightlyReviewPanel
          today={today}
          existing={state.nightlyReviews.find((review) => review.date === today)}
          onClose={() => setShowNight(false)}
          onSave={(review) => {
            onStateChange(upsertNightlyReview(state, review));
            setShowNight(false);
            navigate("/logs");
          }}
        />
      )}
    </section>
  );
}

function DailyPlanForm({
  plan,
  today,
  onCancel,
  onSave,
}: {
  plan?: DailyPlan;
  today: string;
  onCancel?: () => void;
  onSave: (plan: DailyPlan) => void;
}) {
  const [mainTask, setMainTask] = useState(plan?.mainTask ?? "");
  const [firstAction, setFirstAction] = useState(plan?.firstAction ?? "");
  const [avoidExcuse, setAvoidExcuse] = useState(plan?.avoidExcuse ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    const now = new Date().toISOString();
    onSave({
      id: plan?.id ?? newId("plan"),
      date: today,
      mainTask: mainTask.trim(),
      firstAction: firstAction.trim(),
      avoidExcuse: avoidExcuse.trim(),
      status: plan?.status ?? "active",
      createdAt: plan?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <form className="panel" onSubmit={submit}>
      <h2>今日の重要行動</h2>
      <label>
        今日の一番大事なこと
        <input required value={mainTask} onChange={(event) => setMainTask(event.target.value)} placeholder="例: 基本情報の過去問を15分やる" />
      </label>
      <label>
        最初の15分でやること
        <input required value={firstAction} onChange={(event) => setFirstAction(event.target.value)} placeholder="例: 問題集アプリを開いて5問解く" />
      </label>
      <label>
        今日渡したくない言い訳
        <input required value={avoidExcuse} onChange={(event) => setAvoidExcuse(event.target.value)} placeholder="例: 寝不足だったから" />
      </label>
      <div className="buttonRow">
        <button className="primaryButton" type="submit">
          保存
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            戻る
          </button>
        )}
      </div>
    </form>
  );
}

type EscapeInput = Pick<HandicapLog, "triggerType" | "excuseType" | "returnedToTask"> & { note: string };

function EscapePanel({ onClose, onSave }: { onClose: () => void; onSave: (input: EscapeInput) => void }) {
  const [triggerType, setTriggerType] = useState<TriggerType>("smartphone");
  const [excuseType, setExcuseType] = useState<ExcuseType>("tired");
  const [note, setNote] = useState("");

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="逃げそうログ">
      <form className="sheet" onSubmit={(event) => event.preventDefault()}>
        <div className="sheetHeader">
          <h2>今、何に逃げそう？</h2>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <OptionGrid value={triggerType} labels={triggerLabels} onChange={setTriggerType} />
        <h3>今の言い訳は？</h3>
        <OptionGrid value={excuseType} labels={excuseLabels} onChange={setExcuseType} />
        <label>
          メモ
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="任意。短くでOK" />
        </label>
        <div className="buttonColumn">
          <button className="primaryButton" type="button" onClick={() => onSave({ triggerType, excuseType, note, returnedToTask: true })}>
            戻る
          </button>
          <button type="button" onClick={() => onSave({ triggerType, excuseType, note, returnedToTask: false })}>
            今日は無理。記録だけ残す
          </button>
        </div>
      </form>
    </div>
  );
}

function TimerPanel({
  plan,
  timer,
  onInterrupt,
  onFinish,
  onSave,
}: {
  plan?: DailyPlan;
  timer: TimerDraft;
  onInterrupt: () => void;
  onFinish: () => void;
  onSave: (result: FocusSessionResult, memo: string) => void;
}) {
  const [result, setResult] = useState<FocusSessionResult>("completed");
  const [memo, setMemo] = useState("");
  const minutes = String(Math.floor(timer.secondsLeft / 60)).padStart(2, "0");
  const seconds = String(timer.secondsLeft % 60).padStart(2, "0");

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="15分タイマー">
      <section className="sheet timerSheet">
        <p className="eyebrow">15分だけやる</p>
        <h2 className="timerText">
          {minutes}:{seconds}
        </h2>
        <InfoBlock label="今やること" value={plan?.firstAction || "今日の重要行動を保存してください。"} />
        {!timer.openResult ? (
          <div className="buttonRow">
            <button type="button" onClick={onInterrupt}>
              中断する
            </button>
            <button className="primaryButton" type="button" onClick={onFinish}>
              終了する
            </button>
          </div>
        ) : (
          <div className="resultPanel">
            <h3>15分やった？</h3>
            <OptionGrid value={result} labels={resultLabels} onChange={setResult} />
            <label>
              メモ
              <textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="任意。成果ではなく事実だけ" />
            </label>
            <button className="primaryButton" type="button" onClick={() => onSave(result, memo)}>
              保存
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function NightlyReviewPanel({
  today,
  existing,
  onClose,
  onSave,
}: {
  today: string;
  existing?: NightlyReview;
  onClose: () => void;
  onSave: (review: NightlyReview) => void;
}) {
  const [gaveExcuseLevel, setGaveExcuseLevel] = useState<GaveExcuseLevel>(existing?.gaveExcuseLevel ?? "none");
  const [mainExcuseSource, setMainExcuseSource] = useState(existing?.mainExcuseSource ?? "");
  const [memo, setMemo] = useState(existing?.memo ?? "");
  const [tomorrowTask, setTomorrowTask] = useState(existing?.tomorrowTask ?? "");
  const [tomorrowFirstAction, setTomorrowFirstAction] = useState(existing?.tomorrowFirstAction ?? "");
  const [tomorrowAvoidExcuse, setTomorrowAvoidExcuse] = useState(existing?.tomorrowAvoidExcuse ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      id: existing?.id ?? newId("night"),
      date: today,
      gaveExcuseLevel,
      mainExcuseSource: mainExcuseSource.trim() || undefined,
      memo: memo.trim() || undefined,
      tomorrowTask: tomorrowTask.trim() || undefined,
      tomorrowFirstAction: tomorrowFirstAction.trim() || undefined,
      tomorrowAvoidExcuse: tomorrowAvoidExcuse.trim() || undefined,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="夜のチェック">
      <form className="sheet" onSubmit={submit}>
        <div className="sheetHeader">
          <h2>夜のチェック</h2>
          <button type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
        <h3>今日、明日の自分に言い訳を渡した？</h3>
        <OptionGrid value={gaveExcuseLevel} labels={gaveExcuseLabels} onChange={setGaveExcuseLevel} />
        <label>
          主な言い訳材料
          <input value={mainExcuseSource} onChange={(event) => setMainExcuseSource(event.target.value)} placeholder="例: 夜更かし、スマホ、情報収集" />
        </label>
        <label>
          メモ
          <textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="任意。責めずに事実だけ" />
        </label>
        <label>
          明日の一番大事なこと
          <input value={tomorrowTask} onChange={(event) => setTomorrowTask(event.target.value)} placeholder="例: 過去問を15分やる" />
        </label>
        <label>
          明日の最初の15分でやること
          <input value={tomorrowFirstAction} onChange={(event) => setTomorrowFirstAction(event.target.value)} placeholder="例: アプリを開いて5問解く" />
        </label>
        <label>
          明日に渡したくない言い訳
          <input value={tomorrowAvoidExcuse} onChange={(event) => setTomorrowAvoidExcuse(event.target.value)} placeholder="例: 時間がなかったから" />
        </label>
        <button className="primaryButton" type="submit">
          保存
        </button>
      </form>
    </div>
  );
}

function LogsPage({ state }: { state: AppState }) {
  const items = buildTimeline(state);
  const groups = groupByDate(items);

  return (
    <section className="screen">
      <div className="sectionHeader">
        <h2>記録一覧</h2>
        <Link to="/">今日に戻る</Link>
      </div>
      {groups.length === 0 ? (
        <section className="panel">
          <p className="empty">まだ記録はありません。</p>
        </section>
      ) : (
        groups.map(([date, dayItems]) => (
          <section className="panel" key={date}>
            <h3>{formatJapaneseDate(date)}</h3>
            <div className="timeline">
              {dayItems.map((item) => (
                <article className="timelineItem" key={item.id}>
                  <span>{item.time}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  );
}

function ReviewPage({ state }: { state: AppState }) {
  const summary = useMemo(() => buildReview(state), [state]);

  return (
    <section className="screen">
      <h2>過去7日間</h2>
      <div className="summaryGrid">
        <Metric label="逃げそうログ" value={`${summary.totalLogs}回`} />
        <Metric label="15分戻れた" value={`${summary.returnedLogs}回`} />
        <Metric label="戻れた率" value={summary.totalLogs ? `${summary.returnRate}%` : "データなし"} />
      </div>
      <Ranking title="多い逃げ先" rows={summary.triggerRanking} />
      <Ranking title="多い言い訳" rows={summary.excuseRanking} />
      <section className="panel">
        <h3>日別</h3>
        <div className="dayList">
          {summary.days.map((day) => (
            <article className="dayItem" key={day.date}>
              <div>
                <strong>{formatJapaneseDate(day.date)}</strong>
                <p>{day.plan?.mainTask || "重要行動なし"}</p>
              </div>
              <span>
                {day.logCount}件 / {day.returnedCount}戻り
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function Ranking({ title, rows }: { title: string; rows: Array<{ label: string; count: number }> }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {rows.length === 0 ? (
        <p className="empty">データなし</p>
      ) : (
        <ol className="rankingList">
          {rows.map((row) => (
            <li key={row.label}>
              <span>{row.label}</span>
              <strong>{row.count}回</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function OptionGrid<T extends string>({ value, labels, onChange }: { value: T; labels: Record<T, string>; onChange: (value: T) => void }) {
  return (
    <div className="chipGrid">
      {(Object.keys(labels) as T[]).map((key) => (
        <button key={key} type="button" className={value === key ? "chip active" : "chip"} onClick={() => onChange(key)}>
          {labels[key]}
        </button>
      ))}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="fieldTitle">{label}</p>
      <p className="infoText">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getPlanForDate(state: AppState, date: string) {
  return state.dailyPlans.find((plan) => plan.date === date);
}

function createBlankPlan(date: string): DailyPlan {
  const now = new Date().toISOString();
  return {
    id: newId("plan"),
    date,
    mainTask: "",
    firstAction: "",
    avoidExcuse: "",
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}

type TimelineItem = {
  id: string;
  date: string;
  time: string;
  sortAt: string;
  title: string;
  body: string;
};

function buildTimeline(state: AppState): TimelineItem[] {
  const planById = new Map(state.dailyPlans.map((plan) => [plan.id, plan]));
  const plans = state.dailyPlans.map((plan) => ({
    id: `plan-${plan.id}`,
    date: plan.date,
    time: timeFromIso(plan.updatedAt),
    sortAt: plan.updatedAt,
    title: "今日の重要行動",
    body: `${plan.mainTask} / 最初の15分: ${plan.firstAction}`,
  }));
  const logs = state.handicapLogs.map((log) => ({
    id: `log-${log.id}`,
    date: dateKeyFromIso(log.createdAt),
    time: timeFromIso(log.createdAt),
    sortAt: log.createdAt,
    title: "逃げそう",
    body: `逃げ先: ${triggerLabels[log.triggerType]} / 言い訳: ${excuseLabels[log.excuseType]} / 戻れた: ${log.returnedToTask ? "はい" : "いいえ"}${log.note ? ` / ${log.note}` : ""}`,
  }));
  const sessions = state.focusSessions.map((session) => ({
    id: `focus-${session.id}`,
    date: dateKeyFromIso(session.createdAt),
    time: `${timeFromIso(session.startedAt)}-${session.endedAt ? timeFromIso(session.endedAt) : ""}`,
    sortAt: session.createdAt,
    title: "15分実行",
    body: `結果: ${resultLabels[session.result]}${planById.get(session.dailyPlanId)?.firstAction ? ` / ${planById.get(session.dailyPlanId)?.firstAction}` : ""}${session.memo ? ` / ${session.memo}` : ""}`,
  }));
  const reviews = state.nightlyReviews.map((review) => ({
    id: `night-${review.id}`,
    date: review.date,
    time: timeFromIso(review.createdAt),
    sortAt: review.createdAt,
    title: "夜のチェック",
    body: `言い訳: ${gaveExcuseLabels[review.gaveExcuseLevel]}${review.mainExcuseSource ? ` / 材料: ${review.mainExcuseSource}` : ""}${review.tomorrowTask ? ` / 明日: ${review.tomorrowTask}` : ""}`,
  }));
  return [...plans, ...logs, ...sessions, ...reviews].sort((a, b) => b.sortAt.localeCompare(a.sortAt));
}

function groupByDate(items: TimelineItem[]) {
  const groups = new Map<string, TimelineItem[]>();
  for (const item of items) {
    groups.set(item.date, [...(groups.get(item.date) ?? []), item]);
  }
  return [...groups.entries()];
}

function buildReview(state: AppState) {
  const days = lastDays(7);
  const logs = state.handicapLogs.filter((log) => days.includes(dateKeyFromIso(log.createdAt)));
  const returnedLogs = logs.filter((log) => log.returnedToTask === true).length;
  return {
    totalLogs: logs.length,
    returnedLogs,
    returnRate: Math.round((returnedLogs / logs.length) * 100),
    triggerRanking: rank(logs, (log) => triggerLabels[log.triggerType]),
    excuseRanking: rank(logs, (log) => excuseLabels[log.excuseType]),
    days: days.map((date) => {
      const dayLogs = logs.filter((log) => dateKeyFromIso(log.createdAt) === date);
      return {
        date,
        plan: getPlanForDate(state, date),
        logCount: dayLogs.length,
        returnedCount: dayLogs.filter((log) => log.returnedToTask === true).length,
      };
    }),
  };
}

function rank<T>(items: T[], labelFor: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(labelFor(item), (counts.get(labelFor(item)) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

function lastDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return todayKey(date);
  });
}

function formatJapaneseDate(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function timeFromIso(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
