/**
 * Internal dependencies
 */
import { loginUser } from './login-user';
import { WP_ADMIN_USER } from './shared/config';

/**
 * Switches the current user to the admin user (if the user
 * running the test is not already the admin user).
 */
export async function switchUserToAdmin() {
	const currentDisplaynameElement = await page.$( '.display-name' );
	if ( ! currentDisplaynameElement ) {
		return;
	}
	const currentDisplayname = await page.evaluate(
		( element ) => element.textContent,
		currentDisplaynameElement
	);
	if ( currentDisplayname === WP_ADMIN_USER.username ) {
		return;
	}
	await loginUser( WP_ADMIN_USER.username, WP_ADMIN_USER.password );
}
