# GithubDiehards

Data visualisation built on Three.js, using data gathered from Githubarchive.org

#####Data extraction:
Our data set, a summary of all activity registered to Github taking place between the hours of 00:00 and 12:00 on the 1st January 2016,
was obtained from githubarchive.org. Each entry in the data set decribes a single event, of which there are more than 20 types.
more info regarding event types is available here: https://developer.github.com/v3/activity/events/types

From this data set, the only entries which contained information regarding the repository in question were those 
entries of type PullRequestEvent. For this reason, this analysis is based on information gleaned only from 
PullRequestEvents occurring during the time period specified. The total number of events analysed was 142,870. Of these events, 
4,645 were of type PullRequestEvent.

These 4,645 events were sorted according to the 'language' field, and a new data set was built. 
This became the data set which would be used in production. It's entries were in the following format:

[ 

    {

      languageName: xxxxx,    //language for this entry

      count: xxxxx,           //number of entries with this language value

      forks: xxxx             //average number of forks on repositories with this language

    },

    {

      languageNam...

    }

]

It is important to bear in mind, therefore, that any conclusions drawn from this data are skewed, and not a proper representation
of ALL activity on Github during this time, but only the Pull request activity. A more complete data set would be relatively easy to
obtain, as further information regarding the active repository is in fact included with each every event type (and not just pull
requests), in the form of a "repo_url" field, which contains a url linking to further information surrounding the repository in
question. A paid subscription to Github is required in order to query directly from the Github API, which, at the time of writing, this
developer did not have.


