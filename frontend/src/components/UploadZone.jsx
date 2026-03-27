import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './UploadZone.module.css'

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'application/pdf': ['.pdf'],
}

export default function UploadZone({ onFile }) {
  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className={styles.wrapper}>
      <div
        {...getRootProps()}
        className={[
          styles.zone,
          isDragActive  ? styles.active  : '',
          isDragReject  ? styles.reject  : '',
        ].join(' ')}
      >
        <input {...getInputProps()} />

        <div className={styles.icon}>
          {isDragReject ? '✕' : isDragActive ? '↓' : '◈'}
        </div>

        <p className={styles.headline}>
          {isDragActive
            ? isDragReject
              ? 'Unsupported file type'
              : 'Drop to scan'
            : 'Drop your document here'}
        </p>

        <p className={styles.sub}>
          or <span className={styles.link}>browse files</span>
        </p>

        <ul className={styles.types}>
          <li>JPG</li>
          <li>PNG</li>
          <li>PDF</li>
          <li>Multi-page PDF</li>
        </ul>
      </div>

      <p className={styles.hint}>Max file size: 50 MB</p>
    </div>
  )
}