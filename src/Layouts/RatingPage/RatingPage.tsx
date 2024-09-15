import { useState } from 'react'
import './RatingPage.css'
import { useRatingStore } from './RatingStore';
import { _L } from '../../Tools/_L';

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
                {_L('feedback')}
            </h3>
            <h2>{_L('feedback_2')}</h2>
            <h4>{_L('rate_our_app')}</h4>
            <div className={"rat " + (rat == 1 ? 'active' : '')} onClick={() => setRat(1)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                    </div>
                    {_L('very_poor')}
                </div>
            </div>
            <div className={"rat " + (rat == 2 ? 'active' : '')} onClick={() => setRat(2)}>
                <div className="check"></div>
                <div className="text">
                    <div className="stars">
                        <span></span>
                        <span></span>
                    </div>
                    {_L('poor')}
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
                    {_L('average')}
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
                    {_L('good')}
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
                    {_L('excellent')}
                </div>
            </div>
            <label htmlFor="rating-input-comment">
                <div className="label">{_L('comments')}</div>
                <div className="_flex">
                    <input id='rating-input-comment' value={comment} placeholder={_L('comments')} type="text"
                        onChange={e => setComment(e.currentTarget.value)}
                        onKeyUp={e => e.code == 'Enter' && e.currentTarget.blur()}
                    />
                    <div className="icon"></div>
                </div>
            </label>
            <div className="btn">
                <div className="cancel" onClick={() => onCancel?.()}>{_L('cancel')}</div>
                <div className="submit" onClick={() => {
                    if(!rat) return
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
                }>{_L('submit')}</div>
            </div>
        </div >
    </div >
}


