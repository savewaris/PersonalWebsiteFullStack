'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaGithub,
  FaCube,
  FaCode,
  FaProjectDiagram,
  FaCheckCircle,
  FaLayerGroup,
  FaMobileAlt,
  FaRobot,
} from 'react-icons/fa';
import type { Project } from '@prisma/client';
import { Modal } from '@/components/ui/Modal';
import styles from './ArchitectureModal.module.css';

interface ArchitectureModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

type TabType = 'diagram' | 'code' | 'principles';

interface BlueprintData {
  subtitle: string;
  icon: 'hex' | 'mobile' | 'ai';
  diagram: {
    leftTitle: string;
    leftItems: string[];
    centerTitle: string;
    centerSubtitle: string;
    centerDetail: string;
    rightTitle: string;
    rightItems: string[];
  };
  snippets: {
    s1: { label: string; file: string; desc: string; code: string };
    s2: { label: string; file: string; desc: string; code: string };
    s3: { label: string; file: string; desc: string; code: string };
  };
  principles: Array<{ title: string; text: string }>;
}

const BLUEPRINTS: Record<string, BlueprintData> = {
  hexagonal: {
    subtitle: 'Clean Hexagonal Architecture (Ports & Adapters) • TypeScript DDD',
    icon: 'hex',
    diagram: {
      leftTitle: 'Driving Adapters (Inbound)',
      leftItems: [
        '• REST API / Next.js Route Handlers',
        '• CLI Command Line Interface',
        '• Message Queue Consumers',
      ],
      centerTitle: 'Pure Domain Core',
      centerSubtitle: 'Entities • Value Objects • Domain Events',
      centerDetail: 'Zero framework dependencies',
      rightTitle: 'Driven Adapters (Outbound)',
      rightItems: [
        '• PostgreSQL / Prisma ORM',
        '• Redis Cache & S3 Storage',
        '• Stripe Payment Gateway / Resend',
      ],
    },
    snippets: {
      s1: {
        label: '1. Domain Entity',
        file: 'src/domain/entities/Order.ts',
        desc: 'Pure Domain Entity with invariant validation and zero framework annotations.',
        code: `export class Order {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    private _items: OrderItem[],
    private _status: OrderStatus,
    public readonly createdAt: Date
  ) {}

  public static create(customerId: string, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new DomainError('Order must contain at least one item');
    }
    return new Order(crypto.randomUUID(), customerId, items, OrderStatus.PENDING, new Date());
  }

  public markAsPaid(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new DomainError('Only pending orders can be marked as paid');
    }
    this._status = OrderStatus.PAID;
  }
}`,
      },
      s2: {
        label: '2. Port Interface',
        file: 'src/domain/ports/OrderRepositoryPort.ts',
        desc: 'Outbound Port abstraction defined and owned by the domain layer.',
        code: `import { Order } from '../entities/Order';

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findPendingOrdersByCustomer(customerId: string): Promise<Order[]>;
}`,
      },
      s3: {
        label: '3. Driven Adapter',
        file: 'src/infrastructure/adapters/PrismaOrderRepository.ts',
        desc: 'Driven Infrastructure Adapter fulfilling the domain port via Prisma ORM.',
        code: `import { OrderRepositoryPort } from '@/domain/ports/OrderRepositoryPort';
import { Order } from '@/domain/entities/Order';
import { prisma } from '@/lib/prisma';

export class PrismaOrderRepository implements OrderRepositoryPort {
  async save(order: Order): Promise<void> {
    await prisma.order.upsert({
      where: { id: order.id },
      update: { status: order.status },
      create: {
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    const record = await prisma.order.findUnique({ where: { id } });
    return record ? OrderMapper.toDomain(record) : null;
  }
}`,
      },
    },
    principles: [
      {
        title: '100% Mockable Domain',
        text: 'Core business logic can be tested in milliseconds without spinning up PostgreSQL, Docker, or external network connections.',
      },
      {
        title: 'Framework Independence',
        text: 'Switch from Express to Next.js or AWS Lambda without rewriting or breaking domain logic.',
      },
      {
        title: 'Strict Dependency Inversion',
        text: 'High-level business policies never depend on low-level database details; both depend on domain-owned port contracts.',
      },
    ],
  },
  nutrin: {
    subtitle: 'Mobile Clean Architecture • Flutter BLoC State Management & Offline Engine',
    icon: 'mobile',
    diagram: {
      leftTitle: 'Presentation Layer (UI)',
      leftItems: [
        '• Flutter Widgets & Screen Trees',
        '• Dynamic Calorie Macro Gauges',
        '• Dark/Light Theming System',
      ],
      centerTitle: 'BLoC & Domain Engine',
      centerSubtitle: 'NutritionBloc • Caloric TDEE Engine • Meal Entities',
      centerDetail: 'Predictable Event-to-State Stream',
      rightTitle: 'Data & Device Layer',
      rightItems: [
        '• Local SQLite / Hive Storage (Offline-First)',
        '• HealthKit & Google Fit Sync',
        '• REST API Food Catalog Client',
      ],
    },
    snippets: {
      s1: {
        label: '1. Meal Entity',
        file: 'lib/domain/entities/meal_log.dart',
        desc: 'Pure Dart domain model representing nutrient intake and caloric boundaries.',
        code: `class MealLog {
  final String id;
  final String foodName;
  final double calories;
  final double proteinGrams;
  final double carbsGrams;
  final double fatGrams;
  final DateTime loggedAt;

  MealLog({
    required this.id,
    required this.foodName,
    required this.calories,
    required this.proteinGrams,
    required this.carbsGrams,
    required this.fatGrams,
    required this.loggedAt,
  });

  bool isWithinMacroTarget(double dailyTarget) => calories <= dailyTarget;
}`,
      },
      s2: {
        label: '2. Nutrition BLoC',
        file: 'lib/presentation/bloc/nutrition_bloc.dart',
        desc: 'BLoC state controller managing asynchronous food logging and daily budget recalculation.',
        code: `class NutritionBloc extends Bloc<NutritionEvent, NutritionState> {
  final LogMealUseCase logMealUseCase;

  NutritionBloc({required this.logMealUseCase}) : super(NutritionInitial()) {
    on<AddMealEvent>((event, emit) async {
      emit(NutritionLoading());
      final result = await logMealUseCase(event.meal);
      result.fold(
        (failure) => emit(NutritionError(failure.message)),
        (success) => emit(MealLoggedSuccess(event.meal)),
      );
    });
  }
}`,
      },
      s3: {
        label: '3. Offline Database',
        file: 'lib/data/datasources/local_meal_database.dart',
        desc: 'Local SQLite persistence layer ensuring zero data loss when logging meals offline.',
        code: `class LocalMealDatabase implements MealLocalDataSource {
  final Database db;
  LocalMealDatabase(this.db);

  Future<void> cacheMeal(MealModel meal) async {
    await db.insert(
      'meals',
      meal.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<List<MealModel>> getTodayMeals() async {
    final res = await db.query('meals', where: 'date = ?', whereArgs: [DateTime.now().toIso8601String()]);
    return res.map((m) => MealModel.fromMap(m)).toList();
  }
}`,
      },
    },
    principles: [
      {
        title: 'Offline-First Resilience',
        text: 'Food logging functions seamlessly with zero latency and no internet connection via local SQLite cache.',
      },
      {
        title: 'Predictable State Stream',
        text: 'BLoC cleanly decouples UI widgets from nutrient calculations, ensuring deterministic screen re-renders.',
      },
      {
        title: 'Cross-Platform Native Speed',
        text: 'Compiled to native 60fps ARM code on both iOS and Android with unified codebase maintenance.',
      },
    ],
  },
  brain: {
    subtitle: 'Autonomous Multi-Agent Swarm • 3-Tier Compilation Gate & Isolated Worktrees',
    icon: 'ai',
    diagram: {
      leftTitle: 'Agent Interface Layer',
      leftItems: [
        '• IDE Extensions (Antigravity/Cursor/Windsurf)',
        '• Autonomous Worktree Runner (Isolated Git)',
        '• Dynamic Cross-CLI File Lock Registry',
      ],
      centerTitle: 'Second Brain Orchestrator',
      centerSubtitle: 'Master Rules (.agentrules/) • Swarm Dispatcher • Memory',
      centerDetail: 'Context Compaction & Live Ledger',
      rightTitle: 'Quality & Verification Gates',
      rightItems: [
        '• Tier 1: Workspace File Scope Check',
        '• Tier 2: TypeScript Compilation Check (tsc)',
        '• Tier 3: Playwright & Axe E2E Verification',
      ],
    },
    snippets: {
      s1: {
        label: '1. Worktree Isolation',
        file: 'scripts/lib/agent-runner.mjs',
        desc: 'Spawns temporary isolated Git worktrees so agent code changes never corrupt active branches.',
        code: `export async function executeInIsolatedWorktree(branchName, taskFn) {
  const worktreeDir = path.join(os.tmpdir(), \`worktree-\${Date.now()}\`);
  await execa('git', ['worktree', 'add', worktreeDir, branchName]);
  try {
    return await taskFn(worktreeDir);
  } finally {
    await execa('git', ['worktree', 'remove', '--force', worktreeDir]);
  }
}`,
      },
      s2: {
        label: '2. 3-Tier Quality Gate',
        file: 'scripts/lib/three-tier-gate.mjs',
        desc: 'Autonomous verification gate executing compiler diagnostics and E2E checks before task handoff.',
        code: `export async function verifyQualityGate(worktreePath) {
  // Tier 1: Workspace Boundary & File Scope
  await verifyFileBoundaries(worktreePath);

  // Tier 2: TypeScript Strict Compilation
  await execa('npx', ['tsc', '--noEmit'], { cwd: worktreePath });

  // Tier 3: Production Build & E2E Validation
  await execa('npm', ['run', 'build'], { cwd: worktreePath });

  return { success: true, timestamp: new Date().toISOString() };
}`,
      },
      s3: {
        label: '3. Cross-CLI File Lock',
        file: 'scripts/lib/lock-manager.mjs',
        desc: 'Prevents race conditions across parallel AI agent sessions modifying common domain files.',
        code: `export class LockManager {
  static acquireLock(filepath, ownerSession) {
    const locks = JSON.parse(fs.readFileSync('.agents/state/locks.json', 'utf8'));
    if (locks[filepath] && locks[filepath].owner !== ownerSession) {
      throw new Error(\`File \${filepath} is locked by active session \${locks[filepath].owner}\`);
    }
    locks[filepath] = { owner: ownerSession, acquiredAt: new Date().toISOString() };
    fs.writeFileSync('.agents/state/locks.json', JSON.stringify(locks, null, 2));
  }
}`,
      },
    },
    principles: [
      {
        title: 'Zero Branch Corruption',
        text: 'Agents work strictly in temporary Git worktrees, shielding the developer branch from broken states.',
      },
      {
        title: 'Autonomous Self-Healing',
        text: 'Compiler errors are trapped by compiler diagnostics and self-corrected before user alert.',
      },
      {
        title: 'Centralized Master Rules',
        text: 'Single source of truth in .agentrules/ dynamically syncs across Antigravity, Cursor, and Windsurf.',
      },
    ],
  },
};

export function ArchitectureModal({ isOpen, project, onClose }: ArchitectureModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('diagram');
  const [activeSnippetKey, setActiveSnippetKey] = useState<'s1' | 's2' | 's3'>('s1');

  // Determine which blueprint to show based on project title or repo
  const getBlueprintKey = (): string => {
    if (!project) return 'hexagonal';
    const text = (project.title + ' ' + (project.repoUrl || '')).toLowerCase();
    if (text.includes('nutrin') || text.includes('nutrition')) return 'nutrin';
    if (text.includes('second-brain') || text.includes('agent')) return 'brain';
    return 'hexagonal';
  };

  const blueprint = BLUEPRINTS[getBlueprintKey()] || BLUEPRINTS.hexagonal;

  // Reset active tab and snippet when project changes (render-time state adjustment pattern)
  const [prevProjectId, setPrevProjectId] = useState<string | undefined>(undefined);
  if (project?.id !== prevProjectId) {
    setPrevProjectId(project?.id);
    setActiveTab('diagram');
    setActiveSnippetKey('s1');
  }

  if (!project) return null;

  const headerActions = project.repoUrl ? (
    <a
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.headerBtn}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: 600,
        background: 'rgba(255, 255, 255, 0.08)',
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textDecoration: 'none',
      }}
    >
      <FaGithub /> <span>Repository</span>
    </a>
  ) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.title}
      subtitle={blueprint.subtitle}
      icon={
        blueprint.icon === 'mobile' ? (
          <FaMobileAlt />
        ) : blueprint.icon === 'ai' ? (
          <FaRobot />
        ) : (
          <FaProjectDiagram />
        )
      }
      size="xl"
      headerActions={headerActions}
      bodyStyle={{ padding: 0 }}
      ariaLabel={`${project.title} Architecture Blueprint`}
    >
      {/* Body */}
      <div className={styles.modalBody}>
              {/* Tab Navigation */}
              <div className={styles.tabNav}>
                <button
                  type="button"
                  onClick={() => setActiveTab('diagram')}
                  className={`${styles.tabBtn} ${activeTab === 'diagram' ? styles.tabBtnActive : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FaProjectDiagram size={13} /> System Architecture Diagram
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('code')}
                  className={`${styles.tabBtn} ${activeTab === 'code' ? styles.tabBtnActive : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FaCode size={13} /> Code Architecture
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('principles')}
                  className={`${styles.tabBtn} ${activeTab === 'principles' ? styles.tabBtnActive : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <FaLayerGroup size={13} /> Engineering Principles
                  </span>
                </button>
              </div>

              {/* TAB 1: Architecture Diagram */}
              {activeTab === 'diagram' && (
                <div className={styles.diagramContainer}>
                  {/* Left Column */}
                  <div className={styles.diagramColumn}>
                    <div className={styles.diagramCard}>
                      <div className={`${styles.diagramCardTitle} ${styles.drivingTag}`}>
                        {blueprint.diagram.leftTitle}
                      </div>
                      <div className={styles.diagramCardText}>
                        {blueprint.diagram.leftItems.map((item, i) => (
                          <div key={i}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center Core */}
                  <div className={styles.diagramColumn}>
                    <div className={styles.coreCenter}>
                      <div className={`${styles.diagramCardTitle} ${styles.coreTag}`}>
                        <FaCube style={{ display: 'inline', marginRight: '4px' }} />
                        {blueprint.diagram.centerTitle}
                      </div>
                      <div className={styles.diagramCardText} style={{ color: '#ffffff' }}>
                        {blueprint.diagram.centerSubtitle}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                        {blueprint.diagram.centerDetail}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className={styles.diagramColumn}>
                    <div className={styles.diagramCard}>
                      <div className={`${styles.diagramCardTitle} ${styles.drivenTag}`}>
                        {blueprint.diagram.rightTitle}
                      </div>
                      <div className={styles.diagramCardText}>
                        {blueprint.diagram.rightItems.map((item, i) => (
                          <div key={i}>{item}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Code Snippets */}
              {activeTab === 'code' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActiveSnippetKey('s1')}
                      className={`${styles.tabBtn} ${activeSnippetKey === 's1' ? styles.tabBtnActive : ''}`}
                    >
                      {blueprint.snippets.s1.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSnippetKey('s2')}
                      className={`${styles.tabBtn} ${activeSnippetKey === 's2' ? styles.tabBtnActive : ''}`}
                    >
                      {blueprint.snippets.s2.label}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSnippetKey('s3')}
                      className={`${styles.tabBtn} ${activeSnippetKey === 's3' ? styles.tabBtnActive : ''}`}
                    >
                      {blueprint.snippets.s3.label}
                    </button>
                  </div>

                  <div className={styles.codeBox}>
                    <div className={styles.codeHeader}>
                      <span>{blueprint.snippets[activeSnippetKey].file}</span>
                      <span style={{ color: '#94a3b8' }}>{blueprint.snippets[activeSnippetKey].desc}</span>
                    </div>
                    <pre className={styles.codePre}>
                      <code>{blueprint.snippets[activeSnippetKey].code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: Principles */}
              {activeTab === 'principles' && (
                <div className={styles.principlesGrid}>
                  {blueprint.principles.map((pr, idx) => (
                    <div key={idx} className={styles.principleItem}>
                      <div className={styles.principleTitle}>
                        <FaCheckCircle color="#10b981" /> {pr.title}
                      </div>
                      <p className={styles.principleText}>{pr.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.modalFooter}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Repository:{' '}
                <strong style={{ color: '#ffffff' }}>
                  {project.repoUrl ? project.repoUrl.replace('https://github.com/', '') : 'savewaris'}
                </strong>
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.footerBtn} ${styles.footerBtnPrimary}`}
                  >
                    <FaGithub /> Explore Repository
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={`${styles.footerBtn} ${styles.footerBtnSecondary}`}
                >
                  Close
                </button>
              </div>
      </div>
    </Modal>
  );
}
