export default function DeleteModal({ text, close, handleDelete }) {
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      id="deleteModal"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger">
            <h1 className="modal-title text-white fs-5" id="exampleModalLabel">
              刪除
            </h1>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={close}
            />
          </div>
          <div className="modal-body">確認刪除{text}嗎?</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={close}>
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
