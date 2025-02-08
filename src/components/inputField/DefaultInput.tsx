import React from 'react'
import styled from 'styled-components'

interface DefaultInputProps {
    category: string;           // input 카테고리 명
    placeholder: string;     // 입력 필드의 플레이스홀더
    type?: string;          // 입력 필드의 타입 (기본값은 text)
    value: string;          // 입력 필드의 값
    onChangeFunc: (event: React.ChangeEvent<HTMLInputElement>) => void; // onChange 핸들러
    isSelect?: boolean;         // select 여부 (기본값 false)
    options?: Array<{ value: string | number; label: string }> | string[];
    isNumberSelect?: boolean;
}

const DefaultInput: React.FC<DefaultInputProps> = ({ category, placeholder, type = "text", value, onChangeFunc, isSelect = false, options = [], isNumberSelect = false }) => {
    return (
        <InputContainer>
            <Category className='Podo-Ticket-Body-B3'>{category}</Category>
            {isSelect ? (
                <SelectField
                    className='Podo-Ticket-Body-B4'
                    value={value}
                    onChange={onChangeFunc}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}

                    {/* 숫자 선택 (1~16명) */}
                    {isNumberSelect &&
                        Array.from({ length: 16 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}명
                            </option>
                        ))
                    }

                    {/* 커스텀 옵션 (공연 일정) */}
                    {!isNumberSelect && options?.map((option) => (
                        typeof option === 'string' ? (
                            <option key={option} value={option}>{option}</option>
                        ) : (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )
                    ))}
                </SelectField>
            ) : (
                <InputField
                    className='Podo-Ticket-Body-B4'
                    type={type}
                    placeholder={placeholder}
                    onChange={onChangeFunc}
                    value={value}
                    onFocus={(e) => e.preventDefault()}
                />
            )}
        </InputContainer>
    )
}

export default DefaultInput

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;

    user-select: none; /* 텍스트 선택 방지 */
    -webkit-user-select: none; /* Safari에서 드래그 방지 */
    -moz-user-select: none; /* Firefox에서 드래그 방지 */
    -ms-user-select: none;
`;

const Category = styled.div`
    margin-bottom: 13px;

    color: var(--grey-7);
`;

const InputField = styled.input`
    border: none;
    outline: none;
    
    width: 100%;
    padding-bottom: 10px;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--grey-4);

    color: var(--gray-80);

    &:focus {
        outline: none;
        border-bottom: 1px solid var(--grey-6);
    }

    &::placeholder {
        font-size: 14px;
        font-weight: 400;
        line-height: 28px;
        color: var(--grey-5); 
    }

`;

const SelectField = styled.select`
    border: none;
    outline: none;

    width: 100%;
    padding-bottom: 10px;
    
    background: transparent;
    border-bottom: 1px solid var(--grey-4);

    color: var(--gray-80);

    &:focus {
        outline: none;
        border-bottom: 1px solid var(--grey-6);
    }

    option {
        color: var(--gray-80);
        background-color: white;
        font-size: 14px;
        line-height: 28px;
        padding-left: 5px;
    }
`;