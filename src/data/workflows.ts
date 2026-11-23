export type WorkflowId = 'crm' | 'rag' | 'ocr';

export interface WorkflowLogLine {
  timestamp: string;
  message: string;
  colorClass: 'text-dark-primary' | 'text-dark-tertiary' | 'text-dark-on-surface';
}

export interface WorkflowNode {
  stepLabel: string;
  icon: string;
  title: string;
  description: string;
  accent: 'tertiary' | 'primary' | 'neutral';
}

export interface AiWorkflow {
  id: WorkflowId;
  tabLabel: string;
  mobileBadge: string;
  latency: string;
  mobileStatus: string;
  nodes: [WorkflowNode, WorkflowNode, WorkflowNode];
  logs: WorkflowLogLine[];
}

export const WORKFLOWS: Record<WorkflowId, AiWorkflow> = {
  crm: {
    id: 'crm',
    tabLabel: 'CRM Lead Router',
    mobileBadge: 'CRM Router',
    latency: 'Latency: 1.4s • Status: 200 OK',
    mobileStatus: '[200 OK] Latency: 1.4s • confidence=0.96',
    nodes: [
      {
        stepLabel: '01 • Trigger',
        icon: 'webhook',
        title: 'Webhook Lead Masuk',
        description:
          'Menangkap payload formulir web & WhatsApp secara real-time melalui endpoint n8n.',
        accent: 'tertiary',
      },
      {
        stepLabel: '02 • Agen AI',
        icon: 'psychology',
        title: 'Klasifikasi & Skor LLM',
        description:
          'Mengekstrak anggaran, urgensi, dan kategori layanan ke format JSON terstruktur.',
        accent: 'primary',
      },
      {
        stepLabel: '03 • Output',
        icon: 'send',
        title: 'Sinkronisasi CRM & Alert',
        description:
          'Memperbarui PostgreSQL CRM dan mengirim ringkasan instan ke tim sales via Slack.',
        accent: 'neutral',
      },
    ],
    logs: [
      {
        timestamp: '[18:46:01]',
        message: 'trigger.webhook → payload_id="ld_9482" diterima',
        colorClass: 'text-dark-primary',
      },
      {
        timestamp: '[18:46:02]',
        message: 'agent.llm → intent="AI_AUTOMATION" confidence=0.96',
        colorClass: 'text-dark-tertiary',
      },
      {
        timestamp: '[18:46:02]',
        message: 'action.crm_sync → record tersimpan & notifikasi Slack terkirim',
        colorClass: 'text-dark-on-surface',
      },
    ],
  },
  rag: {
    id: 'rag',
    tabLabel: 'DocsMind RAG Sync',
    mobileBadge: 'RAG Sync',
    latency: 'Latency: 2.1s • Status: 200 OK',
    mobileStatus: '[200 OK] Latency: 2.1s • chunks=38',
    nodes: [
      {
        stepLabel: '01 • Trigger',
        icon: 'sync',
        title: 'Pemantau Dokumen Notion',
        description:
          'Mendeteksi pembaruan halaman dokumentasi produk dan spesifikasi API secara otomatis.',
        accent: 'tertiary',
      },
      {
        stepLabel: '02 • Agen AI',
        icon: 'hub',
        title: 'Chunking & Embedding Vektor',
        description:
          'Memecah teks menjadi segmen semantik dan menyimpannya ke indeks pgvector.',
        accent: 'primary',
      },
      {
        stepLabel: '03 • Output',
        icon: 'support_agent',
        title: 'Pembaruan Agen Support',
        description:
          'Agen dukungan pelanggan langsung menjawab pertanyaan terbaru dengan kutipan sumber.',
        accent: 'neutral',
      },
    ],
    logs: [
      {
        timestamp: '[18:46:10]',
        message: 'watcher.notion → 4 halaman baru terdeteksi',
        colorClass: 'text-dark-primary',
      },
      {
        timestamp: '[18:46:11]',
        message: 'embed.vector → 38 chunk disimpan ke pgvector',
        colorClass: 'text-dark-tertiary',
      },
      {
        timestamp: '[18:46:12]',
        message: 'agent.rag → indeks pengetahuan siap digunakan',
        colorClass: 'text-dark-on-surface',
      },
    ],
  },
  ocr: {
    id: 'ocr',
    tabLabel: 'Invoice OCR Pipeline',
    mobileBadge: 'OCR Pipe',
    latency: 'Latency: 1.8s • Status: 200 OK',
    mobileStatus: '[200 OK] Latency: 1.8s • valid=true',
    nodes: [
      {
        stepLabel: '01 • Trigger',
        icon: 'attach_file',
        title: 'Lampiran Email Faktur',
        description:
          'Mengambil file PDF/gambar faktur masuk dari kotak masuk operasional secara otomatis.',
        accent: 'tertiary',
      },
      {
        stepLabel: '02 • Agen AI',
        icon: 'document_scanner',
        title: 'Ekstraksi Vision & Validasi',
        description:
          'Membaca nomor faktur, tanggal jatuh tempo, dan total nominal dengan akurasi tinggi.',
        accent: 'primary',
      },
      {
        stepLabel: '03 • Output',
        icon: 'database',
        title: 'Entri Ledger & PostgreSQL',
        description:
          'Mencatat transaksi terverifikasi ke database akuntansi dan menandai anomali.',
        accent: 'neutral',
      },
    ],
    logs: [
      {
        timestamp: '[18:46:20]',
        message: 'imap.fetch → invoice_2026_11.pdf diunduh',
        colorClass: 'text-dark-primary',
      },
      {
        timestamp: '[18:46:21]',
        message: 'vision.extract → total="Rp 12.500.000" valid=true',
        colorClass: 'text-dark-tertiary',
      },
      {
        timestamp: '[18:46:22]',
        message: 'db.insert → entri ledger #INV-884 tersimpan',
        colorClass: 'text-dark-on-surface',
      },
    ],
  },
};

export const WORKFLOW_LIST = [WORKFLOWS.crm, WORKFLOWS.rag, WORKFLOWS.ocr];
