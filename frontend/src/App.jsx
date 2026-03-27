import { useState } from 'react'
import UploadZone from './components/UploadZone.jsx'
import ScanResult from './components/ScanResult.jsx'
import Header from './components/Header.jsx'
import styles from './App.module.css'
import axios from 'axios'

export default function App() {
  const [state, setState] = useState('idle') // idle | scanning | done | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  async function handleFile(file) {
    setState('scanning')
    setError('')
    setResult(null)
    setProgress(0)

    const form = new FormData()
    form.append('file', file)

    try {
      const { data } = await axios.post('/api/scan', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 50))
        },
      })
      setProgress(100)
      setResult(data)
      setState('done')
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Unknown error'
      setError(msg)
      setState('error')
    }
  }

  async function handleExportTxt() {
    if (!result) return
    try {
      const resp = await axios.post('/api/export/txt', result, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(resp.data)
      const a = document.createElement('a')
      a.href = url
      const base = (result.filename || 'document').replace(/\.[^.]+$/, '')
      a.download = `${base}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed: ' + (err.message || 'Unknown error'))
    }
  }

  function handleReset() {
    setState('idle')
    setResult(null)
    setError('')
    setProgress(0)
  }

  

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        {state === 'idle' && (
          <UploadZone onFile={handleFile} />
        )}

        {state === 'scanning' && (
          <div className={styles.scanningState}>
            <div className={styles.scannerAnim}>
              <div className={styles.scanLine} />
              <span className={styles.scanLabel}>Scanning document…</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.progressText}>{progress}%</span>
          </div>
        )}

        {state === 'error' && (
          <div className={styles.errorState}>
            <span className={styles.errorIcon}>⚠</span>
            <p className={styles.errorMsg}>{error}</p>
            <button className={styles.resetBtn} onClick={handleReset}>Try Again</button>
          </div>
        )}

        {state === 'done' && result && (
          <ScanResult
            result={result}
            onExportTxt={handleExportTxt}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <span>Powered by SuryaOCR</span>
        <span className={styles.sep}>·</span>
      </footer>
    </div>
  )
}

