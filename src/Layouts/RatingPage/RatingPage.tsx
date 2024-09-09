import { useState } from 'react'
import './RatingPage.css'
import { useRatingStore } from './RatingStore';

export function RatingPage({env, onCancel, onSubmit }: {env:string, onSubmit?: (data: { star: number, comment?: string }) => any, onCancel?: () => any }) {
    const { add_rating } = useRatingStore()

    const [rat, setRat] = useState(0);
    const [comment, setComment] = useState('');
    return <div className="rating-page" onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
    }}>
        <div className="rating-ctn">
            <div className="close" onClick={()=>onCancel?.()}></div>
            <h3>
                Feedback
            </h3>
            <h2>We value your Feedback</h2>
            <h4>Rate Our  App</h4>
            <div className={"rat " + (rat == 1 ? 'active' : '')} onClick={() => setRat(1)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                    </div>
                    Vevry Poor
                </div>
            </div>
            <div className={"rat " + (rat == 2 ? 'active' : '')} onClick={() => setRat(2)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                        <span></span>
                    </div>
                    Poor
                </div>
            </div>
            <div className={"rat " + (rat == 3 ? 'active' : '')} onClick={() => setRat(3)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    Average
                </div>
            </div>
            <div className={"rat " + (rat == 4 ? 'active' : '')} onClick={() => setRat(4)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    Good
                </div>
            </div>
            <div className={"rat " + (rat == 5 ? 'active' : '')} onClick={() => setRat(5)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    Excellent
                </div>
            </div>
            <label htmlFor="rating-input-comment">
                <div className="label">{'Comments'}</div>
                <div className="_flex">
                    <input id='rating-input-comment' value={comment} placeholder='Comments' type="text"
                        onChange={e => setComment(e.currentTarget.value)}
                        onKeyUp={e => e.code == 'Enter' && e.currentTarget.blur()}
                    />
                    <div className="icon"></div>
                </div>
            </label>
            <div className="btn">
                <div className="cancel" onClick={() => onCancel?.()}>Cancel</div>
                <div className="submit" onClick={() => {
                    add_rating({
                        env,
                        message:comment,
                        star:rat
                    }).then((res=>{
                        if(res?.id){
                            localStorage.setItem('user.rating',JSON.stringify(res));
                            return;
                        }
                    }))
                    onSubmit?.({
                        star: rat,
                        comment
                    })
                }
                }>Submit</div>
            </div>
        </div >
    </div >
}


