import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type Plugin,
} from 'chart.js'

// Tree-shaking: hanya daftarkan bagian Chart.js yang dipakai bar chart ini.
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

export interface GrowthPoint {
  year: string
  siswa: number
  alumni: number
}

/** Semua warna sudah berupa rgb()/rgba() — lihat toRgb() untuk alasannya. */
export interface ChartColors {
  primary: string
  primaryHover: string
  alumni: string
  alumniHover: string
  alumniText: string
  tick: string
  grid: string
  axis: string
  tooltipBg: string
  tooltipText: string
}

// ── Format angka (locale Indonesia: titik = ribuan, koma = desimal) ──────────
const nf = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 })
const nfFull = new Intl.NumberFormat('id-ID')

export const fmt = (v: number) => (v >= 1000 ? `${nf.format(v / 1000)}rb` : nf.format(v))
export const fmtFull = (v: number) => nfFull.format(v)

// ── Skala Y otomatis: 4 interval dengan step "bulat" (1, 2, 2.5, 5 × 10^n) ───
const niceStep = (rawStep: number) => {
  const mag = 10 ** Math.floor(Math.log10(rawStep))
  const f = rawStep / mag
  return ([1, 2, 2.5, 5, 10].find(n => f <= n) ?? 10) * mag
}

export const getAxis = (data: GrowthPoint[]) => {
  const max = Math.max(...data.map(d => Math.max(d.siswa, d.alumni)))
  const step = niceStep(max / 4)
  return { step, max: step * 4 }
}

// ── Warna ────────────────────────────────────────────────────────────────────
// Token tema memakai oklch(). Chart.js mem-parse warna sendiri (untuk efek
// hover, dll.) dan tidak mengenali oklch, jadi setiap warna dinormalkan ke
// rgb lewat canvas 1×1 — browser yang melakukan konversinya.
let probe: CanvasRenderingContext2D | null = null

const toRgbTuple = (cssColor: string): [number, number, number, number] => {
  if (!probe) {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    probe = c.getContext('2d', { willReadFrequently: true })
  }
  if (!probe) return [0, 0, 0, 255]
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = '#000'
  probe.fillStyle = cssColor
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data
  return [r as number, g as number, b as number, a as number]
}

const rgba = (cssColor: string, alpha = 1) => {
  const [r, g, b, a] = toRgbTuple(cssColor)
  return `rgba(${r}, ${g}, ${b}, ${+(alpha * (a / 255)).toFixed(3)})`
}

const lighten = (cssColor: string, amount = 0.14) => {
  const [r, g, b] = toRgbTuple(cssColor)
  const mix = (c: number) => Math.round(c + (255 - c) * amount)
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
}

/**
 * Baca warna dari CSS variable pada `el`. Variabel --alumni / --alumni-text
 * didefinisikan di FeaturesSection.vue (punya varian dark mode sendiri).
 */
export const readThemeColors = (el: HTMLElement): ChartColors => {
  const cs = getComputedStyle(el)
  const v = (name: string) => cs.getPropertyValue(name).trim()
  const primary = rgba(v('--primary'))
  const alumni = rgba(v('--alumni'))
  return {
    primary,
    primaryHover: lighten(primary),
    alumni,
    alumniHover: lighten(alumni),
    alumniText: rgba(v('--alumni-text')),
    tick: rgba(v('--muted-foreground')),
    grid: rgba(v('--muted-foreground'), 0.28),
    axis: rgba(v('--border')),
    tooltipBg: rgba(v('--foreground'), 0.94),
    tooltipText: rgba(v('--background')),
  }
}

// Di bawah lebar ini label nilai di atas bar disembunyikan (tidak muat);
// pengguna mobile memakai tooltip (tap) dan tabel ringkas.
const VALUE_LABEL_MIN_WIDTH = 560

export const createUserGrowthChart = (
  canvas: HTMLCanvasElement,
  data: GrowthPoint[],
  initialColors: ChartColors,
  opts: { animate: boolean } = { animate: true },
) => {
  let colors = initialColors
  const axis = getAxis(data)

  Chart.defaults.font.family = getComputedStyle(canvas).fontFamily
  Chart.defaults.font.size = 11

  // Label nilai di atas tiap bar (Chart.js tidak punya ini bawaan).
  const valueLabels: Plugin<'bar'> = {
    id: 'valueLabels',
    afterDatasetsDraw(chart) {
      if (chart.width < VALUE_LABEL_MIN_WIDTH) return
      const { ctx } = chart
      ctx.save()
      ctx.font = `600 10px ${Chart.defaults.font.family}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      chart.data.datasets.forEach((ds, di) => {
        if (!chart.isDatasetVisible(di)) return
        ctx.fillStyle = di === 0 ? colors.primary : colors.alumniText
        chart.getDatasetMeta(di).data.forEach((bar, i) => {
          ctx.fillText(fmt(ds.data[i] as number), bar.x, bar.y - 4)
        })
      })
      ctx.restore()
    },
  }

  const chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map(d => d.year),
      datasets: [
        {
          label: 'Siswa Aktif',
          data: data.map(d => d.siswa),
          backgroundColor: colors.primary,
          hoverBackgroundColor: colors.primaryHover,
          borderRadius: 4,
          borderSkipped: 'bottom',
          maxBarThickness: 48,
        },
        {
          label: 'Alumni Lulus',
          data: data.map(d => d.alumni),
          backgroundColor: colors.alumni,
          hoverBackgroundColor: colors.alumniHover,
          borderRadius: 4,
          borderSkipped: 'bottom',
          maxBarThickness: 48,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: opts.animate ? { duration: 700, easing: 'easeOutCubic' } : false,
      // Tap/hover di mana saja pada satu tahun menampilkan kedua seri,
      // termasuk bar yang sangat pendek atau bernilai 0.
      interaction: { mode: 'index', intersect: false },
      // Ruang di atas bar tertinggi untuk label nilai.
      layout: { padding: { top: 20 } },
      scales: {
        x: {
          grid: { display: false },
          border: { color: colors.axis },
          ticks: { color: colors.tick },
        },
        y: {
          min: 0,
          max: axis.max,
          // Di Chart.js v4 pola putus-putus gridline diatur lewat border.dash.
          border: { display: false, dash: [4, 4] },
          grid: { color: colors.grid, drawTicks: false },
          ticks: {
            color: colors.tick,
            stepSize: axis.step,
            padding: 8,
            callback: v => fmt(Number(v)),
          },
        },
      },
      plugins: {
        legend: { display: false } as never, // legend HTML di komponen; plugin Legend tidak diregistrasi
        tooltip: {
          backgroundColor: colors.tooltipBg,
          titleColor: colors.tooltipText,
          bodyColor: colors.tooltipText,
          padding: 10,
          cornerRadius: 8,
          boxPadding: 4,
          callbacks: {
            title: items => `Tahun ${items[0]?.label ?? ''}`,
            label: ctx => ` ${ctx.dataset.label}: ${fmtFull(ctx.parsed.y ?? 0)}`,
          },
        },
      },
    },
    plugins: [valueLabels],
  })

  /** Terapkan ulang warna (dipanggil saat dark/light mode berganti). */
  const applyTheme = (next: ChartColors) => {
    colors = next
    const [siswa, alumni] = chart.data.datasets
    if (siswa) { siswa.backgroundColor = next.primary; siswa.hoverBackgroundColor = next.primaryHover }
    if (alumni) { alumni.backgroundColor = next.alumni; alumni.hoverBackgroundColor = next.alumniHover }
    const { x, y } = chart.options.scales as Record<'x' | 'y', any>
    x.ticks.color = next.tick
    x.border.color = next.axis
    y.ticks.color = next.tick
    y.grid.color = next.grid
    const tip = chart.options.plugins!.tooltip as any
    tip.backgroundColor = next.tooltipBg
    tip.titleColor = next.tooltipText
    tip.bodyColor = next.tooltipText
    chart.update('none')
  }

  return { chart, applyTheme, destroy: () => chart.destroy() }
}
