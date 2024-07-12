'use client';
import { useCallback, useEffect, useState } from 'react';
import Wrapper from '@/components/shared/Wrapper';
import InputSet from '@/components/shared/input/index';
import useInputChange from '@/hooks/input/useInputChange';
import TextButton from '@/components/shared/buttons/TextButton';
import { conceptMap } from '@/components/shared/input/inputConfig';
import AuthPopup from '@/components/signup/Popup';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function FindPw() {
  const [isLoading, setIsLoading] = useState(false); // api 로딩 스피너
  const { value, onChangeInputValue } = useInputChange();
  const [isSubmit, setIsSubmit] = useState(false);
  const [popupMsg, setPopupMsg] = useState({
    // 비밀번호 찾기 팝업 메세지
    title: '',
    msg: '',
  });
  const [isShowPopup, setIsShowPopup] = useState(false); //팝업
  const [isFormValid, setIsFormValid] = useState(false); //폼 유효성 체크

  const validateForm = useCallback(() => {
    const isNameValid = conceptMap.name.doValidation(value.name);
    const isIdValid = conceptMap.loginId.doValidation(value.loginId);
    const isEmailValid = conceptMap.email.doValidation(value.email);
    setIsFormValid(isNameValid && isIdValid && isEmailValid);
  }, [value.name, value.loginId, value.email]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const fetchData = async () => {
    setIsSubmit(true);
    if (!isFormValid) return;
    // 로딩 스피너
    setIsLoading(true);

    // 비밀번호 찾기 api
    const response = await fetch('/api/find/pw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: value.name.trim(),
        user_id: value.loginId.trim(),
        email: value.email.trim(),
      }),
    });
    // 팝업 창 띄위기
    setIsShowPopup(true);

    if (response.ok) {
      // 에러 메시지 설정
      setPopupMsg({
        title: '비밀번호 재설정 링크 전송',
        msg: '이메일 확인 후 비밀번호를 변경해주세요',
      });
      // 입력값비우기
      value.name = '';
      value.loginId = '';
      value.email = '';
    } else {
      setPopupMsg({
        title: '비밀번호 찾기 오류',
        msg: '입력한 내용을 다시 확인해주세요.',
      });
    }
    setIsLoading(false);
  };

  // 팝업 닫기
  const handleClosePopuup = () => {
    setIsShowPopup(false);
  };

  return (
    <>
      {isShowPopup && (
        <AuthPopup
          onClose={handleClosePopuup}
          error={true}
          title={popupMsg.title}
          errorMessage={popupMsg.msg}
        />
      )}
      <main className="flex justify-center items-center h-screen">
        <Wrapper padding="px-24 py-20" width="w-[590px]">
          <div className="flex flex-col items-center w-96 h-full ">
            <h3 className="h3 font-bold text-center mb-10 text-primary-900">
              비밀번호 찾기
            </h3>
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <InputSet className="flex flex-col gap-4">
                {/* 이름 / 아이디 / 이메일 입력 폼 */}
                <InputSet.Validated
                  onChange={onChangeInputValue}
                  value={value.name}
                  type="text"
                  isSubmit={isSubmit}
                  concept="name"
                />
                <InputSet.Validated
                  onChange={onChangeInputValue}
                  value={value.loginId}
                  isSubmit={isSubmit}
                  type="text"
                  concept="loginId"
                />
                <InputSet.Validated
                  onChange={onChangeInputValue}
                  value={value.email}
                  isSubmit={isSubmit}
                  type="email"
                  concept="email"
                />
                {/* submit 비밀번호 찾기 버튼 */}
                <TextButton className="mt-8" onClick={fetchData}>
                  확인
                </TextButton>
              </InputSet>
            )}
          </div>
        </Wrapper>
      </main>
    </>
  );
}