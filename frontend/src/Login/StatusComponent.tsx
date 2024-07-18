import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkmark } from 'react-checkmark'

const SignUpSucess = () => {
    return (
        <>
            <div className="flex flex-row">
                <Checkmark size='21px' />
                <div className="mx-2">Account Created Successfully</div>
            </div>
        </>
    )
}

const error = (prop) =>{
    return(
    <>
        <div className="flex flex-row">
            <FontAwesomeIcon icon={faCircleExclamation} />
            <div className="mx-2">{prop}</div>
        </div>
    </>)
    }

export {error, SignUpSucess};