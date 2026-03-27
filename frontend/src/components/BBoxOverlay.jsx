import styles from './BBoxOverlay.module.css'

export default function BBoxOverlay({ blocks, pageWidth, pageHeight, showBoxes, imageUrl }) {
  const aspectRatio = pageHeight > 0 ? pageWidth / pageHeight : 0.707

  return (
    <div
      className={styles.container}
      style={{ aspectRatio: `${aspectRatio}` }}
    >
      {/* ── Actual Document Review ── */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="Scanned Review" 
          className={styles.documentImage} 
        />
      ) : (
        <div className={styles.paper}>
          <span className={styles.paperLabel}>Document preview</span>
          <span className={styles.paperSub}>Bounding boxes shown below</span>
        </div>
      )}

      {/* ── Bounding box layer ── */}
      {showBoxes && blocks.map((block, i) => (
        <div
          key={i}
          className={styles.bbox}
          style={{
            left:   `${block.bbox.x * 100}%`,
            top:    `${block.bbox.y * 100}%`,
            width:  `${block.bbox.width * 100}%`,
            height: `${block.bbox.height * 100}%`,
          }}
          title={block.text}
        >
          <span className={styles.bboxLabel}>
            {block.text.slice(0, 32)}{block.text.length > 32 ? '…' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}