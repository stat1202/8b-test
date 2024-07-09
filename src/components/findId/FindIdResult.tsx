// UserIdResult.tsx
import KakaoLogo from '@/assets/icons/kakao_logo.svg';
import NaverLogo from '@/assets/icons/naver_logo.svg';
import GoogleLogo from '@/assets/icons/google_logo.svg';
import Link from 'next/link';
import TextButton from '../shared/buttons/TextButton';

const socialLogo: { [key: string]: JSX.Element } = {
  kakao: <KakaoLogo className="w-6 h-6 rounded-full" />,
  naver: <NaverLogo className="w-6 h-6 rounded-full" />,
  google: <GoogleLogo className="w-6 h-6 rounded-full" />,
};

const socialMessages: { [key: string]: string } = {
  kakao: '카카오로 가입하셨습니다.',
  naver: '네이버로 가입하셨습니다.',
  google: '구글로 가입하셨습니다.',
};

type UserIdResult = {
  userId: string;
  createdAt: string;
  social?: string;
};

export default function FindIdResult({
  userId,
  createdAt,
  social,
}: UserIdResult) {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 border border-grayscale-300 rounded-lg w-full h-32 ">
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
          <div className="w-1/2 flex justify-center">
            <div className="flex w-full text-left whitespace-nowrap">
              아이디 :
              {social ? (
                <div className="flex ml-2 gap-x-1">
                  {socialLogo[social]} {socialMessages[social]}
                </div>
              ) : (
                <span className="ml-1">{userId}</span>
              )}
            </div>
          </div>
          <div className="w-1/2 flex justify-center">
            <div className="w-full text-left">
              가입일 :<span className="ml-2">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
      <Link href="/login" className="flex justify-center">
        <TextButton className="mt-8">로그인 하기</TextButton>
      </Link>
      {!social && (
        <Link href="/find/pw" className="flex justify-center">
          <TextButton className="mt-4">비밀번호 찾기</TextButton>
        </Link>
      )}
    </>
  );
}