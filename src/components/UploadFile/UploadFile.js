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
  previewableFileTypes: PropTypes.array,
  onChange: PropTypes.func,
  onRejectFile: PropTypes.func,
  sortFunc: PropTypes.func
}

UploadFile.defaultProps = {
  maxFileSize: 1024 * 1024 * 1024 * 2,
  label: "Перетащите сюда файл или выберите его",
  labelForMultiple: "Перетащите сюда файлы или выберите их",
  multiple: false,
  previewableFileTypes: [
    "image/gif",
    "image/png",
    "image/jpeg",
    "image/svg+xml"
  ],
  sortFunc: (fileA, fileB) => {
    if (fileA.name < fileB.name) {
      return -1
    }
  
    if (fileA.name > fileB.name) {
      return 1
    }
    
    return 0
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", (event) => resolve(event.target.result))
    reader.addEventListener("error", (error) => reject(error))
    reader.readAsDataURL(file)
  })
}

export default function UploadFile({
  label,
  labelForMultiple,
  maxFileSize,
  multiple,
  previewableFileTypes,
  onChange,
  onRejectFile,
  sortFunc
}) {
  const fileInputRef = useRef(null)
  
  const [ files, setFiles ] = useState({})
  
  const getFiles = () => {
    return Object.keys(files).map(k => files[ k ]).sort((a, b) => sortFunc(a.file, b.file))
  }
  
  const checkFileAlreadyExist = (fileName) => typeof files[ fileName ] !== "undefined"
  const checkFileIsPreviewable = (type) => previewableFileTypes.some(f => type.includes(f))
  
  const updateFileList = (filePayload) => {
    setFiles((prev) => {
      return {
        ...prev,
        [ filePayload.file.name ]: filePayload
      }
    })
  }
  
  const handleOnChange = () => {
    const fileList = Array.from(fileInputRef.current.files)
    
    for (const file of fileList) {
      if (checkFileAlreadyExist(file.name)) {
        continue
      }
  
      updateFileList({
        file,
        type: file.type,
        imageUrl: null,
        status: "OK",
        isLoading: true
      })
      
      if (checkFileIsPreviewable(file.type)) {
        getBase64(file)
          .then((fileAsBase64) => updateFileList({
            file,
            type: file.type,
            imageUrl: fileAsBase64,
            status: "OK",
            isLoading: false
          }))
          .catch((error) => {
            onRejectFile(error)
            updateFileList({
              file,
              type: file.type,
              imageUrl: null,
              status: "ERROR",
              isLoading: false
            })
          })
      } else {
        updateFileList({
          file,
          type: file.type,
          imageUrl: null,
          status: "OK",
          isLoading: false
        })
      }
    }
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
          {
            getFiles().map((filePayload) => {
              const isPreviewable = checkFileIsPreviewable(filePayload.file.type)
              return (
                <li key={filePayload.file.name} className={cn(style.previewListItem, {
                  [ style.isPreviewable ]: isPreviewable,
                  [ style.isSimpleFile ]: !isPreviewable
                })}>
                  { isPreviewable && !filePayload.isLoading && <img src={ filePayload.imageUrl } /> }
                  { filePayload.isLoading && <div className={style.loading}><span>🌀</span></div> }
                  <div className={style.previewFileDescription}>
                    <p>{ filePayload.file.name }</p>
                    <p className={style.previewFileSize}>1Мб</p>
                  </div>
                  <button className={style.previewFileDeleteButton}>❌</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}
