export const changeActiveTab = (previousTabId, currentTabId) => {
  const previousTab = document.getElementById(previousTabId);
  const currentTab = document.getElementById(currentTabId);

  previousTab.classList.remove('trip-tabs__btn--active');
  currentTab.classList.add('trip-tabs__btn--active');
};
