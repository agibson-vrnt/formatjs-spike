import React from "react";
import LanguageToggle from "./language-toggle";

var PropTypes = React.PropTypes;

class UserHeader extends React.Component {

	handleLocaleChange( e ) {

		// we might do something to mutate the state on the client-side, but for purposes of this demo, just submit the form
		e.target.parentElement.submit();

	}

	render() {

		return <section className="user-header-control">
			<LanguageToggle {...this.props} />
			<span>You have 3 new messages</span>
			<form method="POST" action="/logout"><button>Log out</button></form>
		</section>;

	}

}
UserHeader.propTypes = {

	locales: PropTypes.array.isRequired

};

export default UserHeader;
