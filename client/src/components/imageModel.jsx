import cancel from '../assests/cancel-icon.svg';

const ImageModel = ({image, handleImageActions}) => {

    const handleActions = (actionName) => {
        handleImageActions(actionName);
    }

    return (
        <div className="image-dialog">
            <img className="image-preview" src={image} alt="" />
            <div className='image-action-btns'>
                <button onClick={() => handleActions('CANCEL')}> Cancel </button>
                <button onClick={() => handleActions('SEND')}> Send </button>
            </div>
        </div>
    )
}

export default ImageModel;