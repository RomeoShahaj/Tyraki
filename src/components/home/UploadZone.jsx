import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../contexts/AppContext'
import { useFileUpload } from '../../hooks/useFileUpload'

function UploadZone() {
  const { t } = useTranslation()
  const { state } = useApp()
  const { handleFiles } = useFileUpload()
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const isLoading = state.uploadState === 'loading'
  const { current, total } = state.uploadProgress

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length) {
      handleFiles(Array.from(files))
    }
  }, [handleFiles])

  const handleFileChange = useCallback((e) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files))
    }
  }, [handleFiles])

  const getTitle = () => {
    if (isLoading && total > 0) {
      return t('upload.file_progress', { current, total })
    }
    if (isLoading) {
      return t('upload.analyzing', { count: 1 })
    }
    return t('upload.drag_title')
  }

  return (
    <div
      className={`upload-zone ${isLoading ? 'loading' : ''} ${isDragOver ? 'dragover' : ''}`}
      id="uploadZone"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="upload-icon">{isLoading ? '⏳' : '📄'}</span>
      <h3>{getTitle()}</h3>
      <p>{t('upload.drag_subtitle')}</p>
      <div className="upload-formats">
        <span className="format-badge">CSV</span>
        <span className="format-badge">PDF</span>
      </div>
      <input
        type="file"
        className="upload-input"
        ref={fileInputRef}
        accept=".csv,.pdf,.xlsx,.xls"
        multiple
        onChange={handleFileChange}
      />
    </div>
  )
}

export default UploadZone
