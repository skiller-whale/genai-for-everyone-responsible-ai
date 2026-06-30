import { useReducer } from 'react';
import type { AppState, Action, UseCase, Stakeholder, Harm } from './types';
import { generateUseCases, generateStakeholders, generateHarms } from './api';
import { Canvas } from './components/Canvas';
import { Column } from './components/Column';
import { Card } from './components/Card';
import { FunctionalityCard } from './components/FunctionalityCard';
import './App.css';

const initialState: AppState = {
  functionality: '',
  useCases: [],
  selectedUseCaseId: null,
  stakeholders: [],
  selectedStakeholderId: null,
  harms: [],
  loading: null,
  error: null,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_FUNCTIONALITY':
      return { ...state, functionality: action.text };

    case 'SET_USE_CASES':
      return {
        ...state,
        useCases: action.useCases,
        selectedUseCaseId: null,
        stakeholders: [],
        selectedStakeholderId: null,
        harms: [],
        loading: null,
      };

    case 'APPEND_USE_CASES':
      return { ...state, useCases: [...state.useCases, ...action.useCases], loading: null };

    case 'SELECT_USE_CASE':
      return {
        ...state,
        selectedUseCaseId: action.id,
        stakeholders: [],
        selectedStakeholderId: null,
        harms: [],
      };

    case 'SET_STAKEHOLDERS':
      return {
        ...state,
        stakeholders: action.stakeholders,
        selectedStakeholderId: null,
        harms: [],
        loading: null,
      };

    case 'APPEND_STAKEHOLDERS':
      return {
        ...state,
        stakeholders: [...state.stakeholders, ...action.stakeholders],
        loading: null,
      };

    case 'SELECT_STAKEHOLDER':
      return { ...state, selectedStakeholderId: action.id, harms: [] };

    case 'SET_HARMS':
      return { ...state, harms: action.harms, loading: null };

    case 'APPEND_HARMS':
      return { ...state, harms: [...state.harms, ...action.harms], loading: null };

    case 'EDIT_CARD': {
      if (action.kind === 'usecase') {
        return {
          ...state,
          useCases: state.useCases.map((u) =>
            u.id === action.id ? { ...u, text: action.text } : u,
          ),
        };
      }
      if (action.kind === 'stakeholder') {
        return {
          ...state,
          stakeholders: state.stakeholders.map((s) =>
            s.id === action.id ? { ...s, text: action.text } : s,
          ),
        };
      }
      return {
        ...state,
        harms: state.harms.map((h) => (h.id === action.id ? { ...h, text: action.text } : h)),
      };
    }

    case 'DELETE_CARD': {
      if (action.kind === 'usecase') {
        const useCases = state.useCases.filter((u) => u.id !== action.id);
        const selectedUseCaseId =
          state.selectedUseCaseId === action.id ? null : state.selectedUseCaseId;
        return {
          ...state,
          useCases,
          selectedUseCaseId,
          ...(selectedUseCaseId === null
            ? { stakeholders: [], selectedStakeholderId: null, harms: [] }
            : {}),
        };
      }
      if (action.kind === 'stakeholder') {
        const stakeholders = state.stakeholders.filter((s) => s.id !== action.id);
        const selectedStakeholderId =
          state.selectedStakeholderId === action.id ? null : state.selectedStakeholderId;
        return {
          ...state,
          stakeholders,
          selectedStakeholderId,
          ...(selectedStakeholderId === null ? { harms: [] } : {}),
        };
      }
      return { ...state, harms: state.harms.filter((h) => h.id !== action.id) };
    }

    case 'ADD_USE_CASE':
      return {
        ...state,
        useCases: [
          ...state.useCases,
          { id: crypto.randomUUID(), text: '', category: 'intended' } satisfies UseCase,
        ],
      };

    case 'ADD_STAKEHOLDER':
      return {
        ...state,
        stakeholders: [
          ...state.stakeholders,
          {
            id: crypto.randomUUID(),
            text: '',
            type: 'direct',
            useCaseId: action.useCaseId,
          } satisfies Stakeholder,
        ],
      };

    case 'ADD_HARM':
      return {
        ...state,
        harms: [
          ...state.harms,
          {
            id: crypto.randomUUID(),
            text: '',
            harmType: 'Other',
            severity: 'not severe',
            stakeholderId: action.stakeholderId,
          } satisfies Harm,
        ],
      };

    case 'SET_LOADING':
      return { ...state, loading: action.loading, error: null };

    case 'SET_ERROR':
      return { ...state, error: action.error, loading: null };

    default:
      return state;
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectedUseCase = state.useCases.find((u) => u.id === state.selectedUseCaseId);
  const selectedStakeholder = state.stakeholders.find(
    (s) => s.id === state.selectedStakeholderId,
  );

  async function handleGenerateUseCases(append = false) {
    dispatch({ type: 'SET_LOADING', loading: 'usecases' });
    try {
      const existing = append ? state.useCases.map((u) => u.text) : [];
      const useCases = await generateUseCases(state.functionality, existing);
      dispatch(append ? { type: 'APPEND_USE_CASES', useCases } : { type: 'SET_USE_CASES', useCases });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) });
    }
  }

  async function handleSelectUseCase(id: string) {
    dispatch({ type: 'SELECT_USE_CASE', id });
    const uc = state.useCases.find((u) => u.id === id);
    if (!uc) return;
    dispatch({ type: 'SET_LOADING', loading: 'stakeholders' });
    try {
      const stakeholders = await generateStakeholders(state.functionality, uc.text, id);
      dispatch({ type: 'SET_STAKEHOLDERS', stakeholders });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) });
    }
  }

  async function handleGenerateMoreStakeholders() {
    if (!selectedUseCase) return;
    dispatch({ type: 'SET_LOADING', loading: 'stakeholders' });
    try {
      const existing = state.stakeholders.map((s) => s.text);
      const stakeholders = await generateStakeholders(
        state.functionality,
        selectedUseCase.text,
        selectedUseCase.id,
        existing,
      );
      dispatch({ type: 'APPEND_STAKEHOLDERS', stakeholders });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) });
    }
  }

  async function handleSelectStakeholder(id: string) {
    dispatch({ type: 'SELECT_STAKEHOLDER', id });
    const sh = state.stakeholders.find((s) => s.id === id);
    if (!sh || !selectedUseCase) return;
    dispatch({ type: 'SET_LOADING', loading: 'harms' });
    try {
      const harms = await generateHarms(
        state.functionality,
        selectedUseCase.text,
        sh.text,
        id,
      );
      dispatch({ type: 'SET_HARMS', harms });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) });
    }
  }

  async function handleGenerateMoreHarms() {
    if (!selectedUseCase || !selectedStakeholder) return;
    dispatch({ type: 'SET_LOADING', loading: 'harms' });
    try {
      const existing = state.harms.map((h) => h.text);
      const harms = await generateHarms(
        state.functionality,
        selectedUseCase.text,
        selectedStakeholder.text,
        selectedStakeholder.id,
        existing,
      );
      dispatch({ type: 'APPEND_HARMS', harms });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: String(e) });
    }
  }

  return (
    <>
      <header className="app-header">
        <h1>Skiller Whale Harms Envisioner</h1>
        <a
          className="citation"
          href="https://arxiv.org/abs/2402.15350"
          target="_blank"
          rel="noreferrer"
          title="Wang, Zijie J. et al. (2024). Farsight: Fostering Responsible AI Awareness During AI Application Prototyping. CHI '24. DOI: 10.1145/3613904.3642335"
        >
          Based on <em>Farsight</em> · Wang et al., CHI 2024
        </a>
      </header>

      {state.error && (
        <div className="error-banner" role="alert">
          {state.error}
          <button onClick={() => dispatch({ type: 'SET_ERROR', error: null })}>×</button>
        </div>
      )}

      <Canvas state={state}>
        <Column title="Functionality" accentColor="#3b82f6">
          <FunctionalityCard
            value={state.functionality}
            onChange={(text) => dispatch({ type: 'SET_FUNCTIONALITY', text })}
            onGenerate={() => handleGenerateUseCases(false)}
            loading={state.loading === 'usecases'}
          />
        </Column>

        <Column title="Use Cases" accentColor="#9333ea">
          {state.useCases.map((uc) => (
            <Card
              key={uc.id}
              cardId={uc.id}
              text={uc.text}
              selected={state.selectedUseCaseId === uc.id}
              className="card-use-case"
              onClick={() => handleSelectUseCase(uc.id)}
              onEdit={(text) => dispatch({ type: 'EDIT_CARD', kind: 'usecase', id: uc.id, text })}
              onDelete={() => dispatch({ type: 'DELETE_CARD', kind: 'usecase', id: uc.id })}
            />
          ))}
          {state.useCases.length === 0 && state.loading !== 'usecases' && (
            <div className="column-hint">← Describe a functionality to begin</div>
          )}
          {state.loading === 'usecases' && (
            <div className="loading-spinner">Generating…</div>
          )}
          {state.useCases.length > 0 && state.loading !== 'usecases' && (
            <>
              <Card
                variant="generate"
                text="Generate more"
                onClick={() => handleGenerateUseCases(true)}
              />
              <Card
                variant="add"
                text="Add your own"
                onClick={() => dispatch({ type: 'ADD_USE_CASE' })}
              />
            </>
          )}
        </Column>

        <Column title="Stakeholders" accentColor="#64748b">
          {state.selectedUseCaseId ? (
            <>
              {state.stakeholders.map((sh) => (
                <Card
                  key={sh.id}
                  cardId={sh.id}
                  text={sh.text}
                  selected={state.selectedStakeholderId === sh.id}
                  className="card-stakeholder"
                  onClick={() => handleSelectStakeholder(sh.id)}
                  onEdit={(text) =>
                    dispatch({ type: 'EDIT_CARD', kind: 'stakeholder', id: sh.id, text })
                  }
                  onDelete={() =>
                    dispatch({ type: 'DELETE_CARD', kind: 'stakeholder', id: sh.id })
                  }
                />
              ))}
              {state.loading === 'stakeholders' && (
                <div className="loading-spinner">Generating…</div>
              )}
              {state.stakeholders.length > 0 && state.loading !== 'stakeholders' && (
                <>
                  <Card
                    variant="generate"
                    text="Generate more"
                    onClick={handleGenerateMoreStakeholders}
                  />
                  <Card
                    variant="add"
                    text="Add your own"
                    onClick={() =>
                      dispatch({ type: 'ADD_STAKEHOLDER', useCaseId: state.selectedUseCaseId! })
                    }
                  />
                </>
              )}
            </>
          ) : (
            <div className="column-hint">← Select a use case</div>
          )}
        </Column>

        <Column title="Harms" accentColor="#ef4444">
          {state.selectedStakeholderId ? (
            <>
              {state.harms.map((harm) => (
                <Card
                  key={harm.id}
                  cardId={harm.id}
                  text={harm.text}
                  className="card-harm"
                  onEdit={(text) =>
                    dispatch({ type: 'EDIT_CARD', kind: 'harm', id: harm.id, text })
                  }
                  onDelete={() => dispatch({ type: 'DELETE_CARD', kind: 'harm', id: harm.id })}
                />
              ))}
              {state.loading === 'harms' && (
                <div className="loading-spinner">Generating…</div>
              )}
              {state.harms.length > 0 && state.loading !== 'harms' && (
                <>
                  <Card
                    variant="generate"
                    text="Generate more"
                    onClick={handleGenerateMoreHarms}
                  />
                  <Card
                    variant="add"
                    text="Add your own"
                    onClick={() =>
                      dispatch({
                        type: 'ADD_HARM',
                        stakeholderId: state.selectedStakeholderId!,
                      })
                    }
                  />
                </>
              )}
            </>
          ) : (
            <div className="column-hint">← Select a stakeholder</div>
          )}
        </Column>
      </Canvas>
    </>
  );
}
