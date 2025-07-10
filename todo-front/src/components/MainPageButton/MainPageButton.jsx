import './mainPageButton.css'

export default function MainPageButton({ text, onClick }) {
    return (
        <button className='main-button' onClick={onClick}>
            {text}
        </button>
    );
}