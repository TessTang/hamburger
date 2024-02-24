import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { MessageContext, handleSuccessMessage, handleErrorMessage } from "../store/messageStore"

export default function CouponsModal({ closeAddCoupon, getCoupons, type, tempCoupon }) {
    const [date, setDate] = useState(new Date());
    const [, dispatch] = useContext(MessageContext)

    const [tempData, setTempData] = useState({
        "title": "",
        "is_enabled": 1,
        "percent": 80,
        "due_date": new Date(),
        "code": "testCode"
    })

    useEffect(() => {
        if (type === "create") {
            setTempData({
                "title": "",
                "is_enabled": 1,
                "percent": 80,
                "due_date": new Date(),
                "code": ""
            })
            setDate(new Date());
        } else if (type === "edit") {
            setTempData(tempCoupon);
            setDate(new Date(tempCoupon.due_date))
        }

    }, [type, tempCoupon])

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (['percent', 'due_date'].includes(name)) {
            setTempData((pre) => {
                return { ...pre, [name]: Number(value) }
            })
        } else if (name === "is_enabled") {
            setTempData((pre) => {
                return { ...pre, [name]: +checked }
            })
        } else {
            setTempData((pre) => {
                return { ...pre, [name]: value }
            })
        }
    }
    const submit = async () => {
        try {
            let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
            let method = 'post';
            if (type === 'edit') {
                api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupon.id}`;
                method = 'put';
            }

            const res = await axios[method](api,
                {
                    data: {
                        ...tempData,
                        due_date: date.getTime(), // 轉換成 unix timestamp
                    },
                }
            );
            handleSuccessMessage(dispatch, res);
            getCoupons();
            closeAddCoupon();
        }
        catch (error) {
            handleErrorMessage(dispatch, error);
            console.log(error)
        }
    }

    return (
        <div
            className='modal fade'
            id="couponModal"
            tabIndex='-1'
            aria-labelledby='exampleModalLabel'
            data-bs-backdrop="static"
            aria-hidden='true'
        >
            <div className='modal-dialog modal-lg'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h1 className='modal-title fs-5' id='exampleModalLabel'>
                            建立新優惠券
                        </h1>
                        <button type='button' className='btn-close' aria-label='Close' onClick={closeAddCoupon} />
                    </div>
                    <div className='modal-body'>
                        <div className='mb-2'>
                            <label className='w-100' htmlFor='title'>
                                標題
                                <input
                                    type='text'
                                    id='title'
                                    placeholder='請輸入標題'
                                    name='title'
                                    className='form-control mt-1'
                                    onChange={handleChange}
                                    value={tempData.title}
                                />
                            </label>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mb-2'>
                                <label className='w-100' htmlFor='percent'>
                                    折扣（%）
                                    <input
                                        type='text'
                                        name='percent'
                                        id='percent'
                                        placeholder='請輸入折扣（%）'
                                        className='form-control mt-1'
                                        onChange={handleChange}
                                        value={tempData.percent}
                                    />
                                </label>
                            </div>
                            <div className='col-md-6 mb-2'>
                                <label className='w-100' htmlFor='due_date'>
                                    到期日
                                    <input
                                        type='date'
                                        id='due_date'
                                        name='due_date'
                                        placeholder='請輸入到期日'
                                        className='form-control mt-1'
                                        onChange={(e) => {
                                            setDate(new Date(e.target.value));
                                        }}
                                        value={`${date.getFullYear().toString()}-${(
                                            date.getMonth() + 1
                                        )
                                            .toString()
                                            .padStart(2, 0)}-${date
                                                .getDate()
                                                .toString()
                                                .padStart(2, 0)}`}
                                    />
                                </label>
                            </div>
                            <div className='col-md-6 mb-2'>
                                <label className='w-100' htmlFor='code'>
                                    優惠碼
                                    <input
                                        type='text'
                                        id='code'
                                        name='code'
                                        placeholder='請輸入優惠碼'
                                        className='form-control mt-1'
                                        onChange={handleChange}
                                        value={tempData.code}
                                    />
                                </label>
                            </div>
                        </div>
                        <label className='form-check-label' htmlFor='is_enabled'>
                            <input
                                className='form-check-input me-2'
                                type='checkbox'
                                id='is_enabled'
                                name='is_enabled'
                                onChange={handleChange}
                                checked={!!tempData.is_enabled}
                            />
                            是否啟用
                        </label>
                    </div>
                    <div className='modal-footer'>
                        <button type='button' className='btn btn-secondary' onClick={closeAddCoupon}>
                            關閉
                        </button>
                        <button type='button' className='btn btn-primary' onClick={submit}>
                            儲存
                        </button>
                    </div>
                </div>
            </div>
        </div>


    );
}



