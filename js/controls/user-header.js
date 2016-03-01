import React, { Component, PropTypes } from "react";
import LanguageToggle from "./language-toggle";

class UserHeader extends Component {

	handleLocaleChange( e ) {

		// we might do something to mutate the state on the client-side, but for purposes of this demo, just submit the form
		e.target.parentElement.submit();

	}

	render() {

		var { formatMessage } = this.props;
		var exampleMessageCount = 3;
		return <section className="user-header-control">
			<LanguageToggle {...this.props} />
			{formatMessage( "you-have-N-messages", { count: exampleMessageCount } )}
			<form method="POST" action="/logout"><button>{formatMessage( "Log out" )}</button></form>
		</section>;

	}

}
UserHeader.propTypes = {

	locales: PropTypes.array.isRequired,
	formatMessage: PropTypes.func.isRequired

};
export default UserHeader;
