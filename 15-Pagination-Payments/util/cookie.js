const cookieUtil = {
  getCookiePosition(cookie, search) {
    let startIndex = cookie.indexOf(search);
    return startIndex == -1 ? -1 : startIndex + search.length;
  },

  getCookieValue(fullCookie, searchedCookie) {
    const cookiePosition = this.getCookiePosition(fullCookie, searchedCookie);
    if (cookiePosition >= 0) {
      return fullCookie.substr(cookiePosition, 4);
    }
    return false;
  }
};

module.exports = cookieUtil;
