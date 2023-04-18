import { useContext } from 'react';
import { UserContext, UserContextType } from '@/lib/context';
import Link from 'next/link';
import PropTypes from 'prop-types';

export default function AuthCheck (props: {
    children: JSX.Element[] | JSX.Element,
    fallback: JSX.Element[] | undefined
}) {
    const { username } = useContext<UserContextType>(UserContext);

    return (
        <>
            {username
                ? props.children
                : props.fallback || <Link href="/enter">You must be signed in.</Link>
            }
        </>
    );
}

AuthCheck.defaultProps = {
    fallback: undefined
};

AuthCheck.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
    fallback: PropTypes.arrayOf(PropTypes.element)
};
