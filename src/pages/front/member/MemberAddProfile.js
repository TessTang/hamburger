import { useState, useEffect, useContext } from 'react';
import { CartData } from '../../../store/frontStore';
export default function MemberAddProfile() {

// const {user} = useContext(CartData)
// console.log(user)
    const [data, setData] = useState({
        'displayName':'',
        'realName':'',
        'phoneNumber': 0,
        'address':'',
      })

    const handleData = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const submit = async (e) => {
       console.log(data)
    }

    return (<>
        <h3>新增會員資料</h3>
        <div className="h-100 d-flex flex-column gap-3 text-center">
            <div className="bg-light d-flex align-items-center p-3">
                <label htmlFor='memberDisplayName' className='col-2'>暱稱</label>
                <div className='d-flex align-items-center flex-wrap border col-10'>
                <input name='displayName' id='memberDisplayName' type="text" onChange={handleData} className='col-12 col-md-7 rounded-4 p-2' maxLength={10}/>
                <div className="ps-2 fw-light">僅於網路顯示，最多十字</div>
                </div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <label htmlFor='memberRealName' className='col-2'>姓名</label>
                <div className='d-flex align-items-center flex-wrap border col-10'>
                <input name='realName' id='memberRealName' type="text" onChange={handleData} className='col-12 col-md-7 rounded-4 p-2' maxLength={10}/>
                <div className="ps-2 fw-light">預設外送用真名，最多十字</div>
                </div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <label htmlFor='memberAddress' className='col-2'>地址</label>
                <div className='d-flex align-items-center flex-wrap border col-10'>
                <input name='address' id='memberAddress' type="text" onChange={handleData} className='col-12 col-md-7 rounded-4 p-2' maxLength={10}/>
                <div className="ps-2 fw-light">預設外送用地址</div>
                </div>
            </div>
            <div className="bg-light d-flex align-items-center p-3">
                <label htmlFor='memberDisplayName' className='col-2'>電話</label>
                <div className='d-flex align-items-center flex-wrap border col-10'>
                <input name='phoneNumber' id='memberDisplayName' type="tel" onChange={handleData} className='col-12 col-md-7 rounded-4 p-2' maxLength={10}/>
                <div className="ps-2 fw-light">預設外送用電話</div>
                </div>
            </div>
            <button type="button" className="btn btn-dark" onClick={submit} >儲存資料</button>
        
        </div>
        
    </>
    )
}