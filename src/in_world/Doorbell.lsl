string home_url = "http://xxx/SecondLife?type=playSound";

default {

	state_entry() {
	}

	touch_start(integer total_number) {
		llHTTPRequest(home_url, [], "");
	}

	http_response( key request_id, integer status, list metadata, string body ) {
	}

}
