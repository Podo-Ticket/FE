import { useNavigate } from 'react-router-dom';

/**
 * 일반화된 경로 이동 유틸리티 함수
 * @param basePath - 기본 경로 (예: '/reserve')
 * @param params - 동적으로 추가할 경로 파라미터 (예: '123', 'edit')
 */
export const useNavigateTo = () => {
    const navigate = useNavigate();

    /**
     * 경로 이동 함수
     * @param basePath - 기본 경로
     * @param params - 추가 경로 파라미터
     */
    const navigateTo = (basePath: string, params?: string | string[]) => {
        let fullPath = basePath;

        if (params) {
            if (Array.isArray(params)) {
                // 배열인 경우 슬래시로 연결
                fullPath += '/' + params.join('/');
            } else {
                // 문자열인 경우 바로 추가
                fullPath += '/' + params;
            }
        }

        navigate(fullPath);
    };

    return navigateTo;
};