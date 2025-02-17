import React from 'react'
import styled from 'styled-components'

import availableSeat from '../../assets/images/purple_rectangle.png'
import selectedSeat from '../../assets/images/lightgrey_rectangle.png'
import disabledSeat from '../../assets/images/purple_rectangle.png'

interface SeatsInfoInfoProps {

}

const SeatsInfo: React.FC<SeatsInfoInfoProps> = ({  }) => {
    return (
        <SeatsInfoContainer>

            <SeatsInfoItem className='Podo-Ticket-Body-B11'>
                <SeatsImage src={selectedSeat} />
                <SeatsDescription>선택 가능 좌석</SeatsDescription>
            </SeatsInfoItem>

            <SeatsInfoItem className='Podo-Ticket-Body-B11'>
                <SeatsImage src={availableSeat} />
                <SeatsDescription>선택한 좌석</SeatsDescription>
            </SeatsInfoItem>

            <SeatsInfoItem className='Podo-Ticket-Body-B11'>
                <SeatsImage src={disabledSeat} />
                <SeatsDescription>선택 불가능 좌석</SeatsDescription>
            </SeatsInfoItem>

        </SeatsInfoContainer>
    )
}

export default SeatsInfo

const SeatsInfoContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;

width: 100%;
border-radius: 10px;
border: 1px solid var(--grey-3);
background: var(--ect-white);
box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.02);

gap: 30px;
padding: 16px 20px;

user-select: none; /* 텍스트 선택 방지 */
-webkit-user-select: none; /* Safari에서 드래그 방지 */
-moz-user-select: none; /* Firefox에서 드래그 방지 */
-ms-user-select: none;
`;

const SeatsInfoItem = styled.div`
display: flex;
justify-content: center;
align-items: center;

gap: 8px;
`;

const SeatsImage = styled.img`
width: 14px;
height: 14px;
`;

const SeatsDescription = styled.span`
color: var(--grey-7);
`;