import PropTypes from "prop-types"
import style from "./UploadFile.module.css"
import cn from "classnames"
import { useRef, useState } from "react"

UploadFile.propTypes = {
  // в байтах
  maxFileSize: PropTypes.number,
  label: PropTypes.string,
  labelForMultiple: PropTypes.string,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  onRejectFile: PropTypes.func
}

UploadFile.defaultProps = {
  maxFileSize: 1024 * 1024 * 1024 * 2,
  label: "Перетащите сюда файл или выберите его",
  labelForMultiple: "Перетащите сюда файлы или выберите их",
  multiple: false
}

export default function UploadFile({ label, labelForMultiple, maxFileSize, multiple, onChange, onRejectFile }) {
  const fileInputRef = useRef(null)
  const [ files, setFiles ] = useState([])
  
  const handleOnChange = () => {
    const fileList = Array.from(fileInputRef.current.files)
    setFiles(fileList)
  }
  
  const handleDragOver = ({ nativeEvent }) => nativeEvent.preventDefault()
  
  const handleDrop = ({ nativeEvent }) => {
    fileInputRef.current.files = nativeEvent.dataTransfer.files
    fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    nativeEvent.preventDefault()
  }
  
  return (
    <div className={style.root}>
      <label className={style.dropZone}
             onDragOver={handleDragOver}
             onDrop={handleDrop}>
        <div className={style.dropZoneDescription}>
          <p className={style.dropZoneIcon}>🌇</p>
          <p className={style.inputFileLabel}>
            { multiple ? labelForMultiple : label }
          </p>
          <p className={style.maxFileDescr}>Макс. размер файла: <strong>2Мб</strong></p>
        </div>
        
        <input className={style.inputFileInstance}
               ref={fileInputRef}
               onChange={handleOnChange}
               type="file"/>
      </label>
      
      <div className={style.previewFilesContainer}>
        <ul className={style.previewList}>
          <li className={cn(style.previewListItem, style.isImage)}>
            <img src="https://images.theconversation.com/files/443350/original/file-20220131-15-1ndq1m6.jpg?ixlib=rb-1.1.0&rect=0%2C0%2C3354%2C2464&q=45&auto=format&w=926&fit=clip" alt="" />
            <div className={style.previewFileDescription}>
              <p>GoldMine.jpg</p>
              <p className={style.previewFileSize}>1Мб</p>
            </div>
            <button className={style.previewFileDeleteButton}>❌</button>
          </li>
  
          <li className={cn(style.previewListItem, style.isSimpleFile)}>
            <div className={style.previewFileDescription}>
              <p>GoldMine.jpg</p>
              <p className={style.previewFileSize}>1Мб</p>
            </div>
            <button className={style.previewFileDeleteButton}>❌</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
