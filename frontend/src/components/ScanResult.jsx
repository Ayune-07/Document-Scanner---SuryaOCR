import { useState } from 'react'
import BBoxOverlay from './BBoxOverlay.jsx'
import styles from './ScanResult.module.css'

export default function ScanResult({ result, onExportTxt, onReset }) {
  const [activePage, setActivePage] = useState(0)
  const [showBoxes, setShowBoxes] = useState(true)
  const [tab, setTab] = useState('text')

  const page = result.pages[activePage]

  return (
    <div className={styles.wrapper}>
      {/* ── Toolbar ───────────────────────────────── */}
      <div className={styles.toolbar}>
        <div className={styles.toolLeft}>
          <span className={styles.filename}>{result.filename}</span>
          <span className={styles.badge}>{result.total_pages}p</span>
        </div>
        <div className={styles.toolRight}>
          <button
            className={[styles.btn, showBoxes ? styles.btnActive : ''].join(' ')}
            onClick={() => setShowBoxes(v => !v)}
            title="Toggle bounding boxes"
          >
            ⊞ Boxes
          </button>
          <button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={onExportTxt}>
            ↓ Export .txt
          </button>
          <button className={styles.btn} onClick={onReset}>
            ✕ New Scan
          </button>
        </div>
      </div>

      {/* ── Page tabs ─────────────────────────────── */}
      {result.total_pages > 1 && (
        <div className={styles.pageTabs}>
          {result.pages.map((_, i) => (
            <button
              key={i}
              className={[styles.pageTab, i === activePage ? styles.pageTabActive : ''].join(' ')}
              onClick={() => setActivePage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ── Main content ──────────────────────────── */}
      <div className={styles.content}>
        {/* Left: image + bbox overlay */}
        <div className={styles.imagePanel}>
          <div className={styles.imageWrap}>
            <BBoxOverlay
              blocks={page.blocks}
              pageWidth={page.width}
              pageHeight={page.height}
              showBoxes={showBoxes}
              imageUrl={page.image}
            />
          </div>
          <p className={styles.imageMeta}>
            {page.width} × {page.height}px · {page.blocks.length} text regions
          </p>
        </div>

        {/* Right: text / blocks panel */}
        <div className={styles.textPanel}>
          <div className={styles.tabBar}>
            <button
              className={[styles.tabBtn, tab === 'text' ? styles.tabActive : ''].join(' ')}
              onClick={() => setTab('text')}
            >Full Text</button>
            <button
              className={[styles.tabBtn, tab === 'blocks' ? styles.tabActive : ''].join(' ')}
              onClick={() => setTab('blocks')}
            >Blocks ({page.blocks.length})</button>
          </div>

          <div className={styles.tabContent}>
            {tab === 'text' && (
              <pre className={styles.fullText}>{page.full_text || '(no text detected)'}</pre>
            )}

            {tab === 'blocks' && (
              <div className={styles.blockList}>
                {page.blocks.length === 0 && (
                  <p className={styles.empty}>No text blocks detected.</p>
                )}
                {page.blocks.map((block, i) => (
                  <div key={i} className={styles.blockItem}>
                    <div className={styles.blockHeader}>
                      <span className={styles.blockIdx}>#{i + 1}</span>
                      <span className={styles.blockConf}>
                        {(block.confidence * 100).toFixed(1)}% conf
                      </span>
                    </div>
                    <p className={styles.blockText}>{block.text}</p>
                    <p className={styles.blockCoords}>
                      x:{(block.bbox.x * 100).toFixed(1)}%
                      &nbsp;y:{(block.bbox.y * 100).toFixed(1)}%
                      &nbsp;w:{(block.bbox.width * 100).toFixed(1)}%
                      &nbsp;h:{(block.bbox.height * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}