import {Post, PostAttributes} from '../models/post.model';
import {Vote, VoteAttributes} from '../models/vote.model';
import {User} from '../models/user.model';
import {Op} from 'sequelize';


export class VoteService {
    public async calculateVotes(postId: number): Promise<number> {
        return Vote.findAll({
            where: {
                    postId: postId
            }
        }).then(votes => {
            let voteCount = 0;
            votes.forEach((vote) => {
                voteCount += vote.vote;
            });
            return voteCount;
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public async voteOfUser(postId: number, userId: number): Promise<number> {
        return Vote.findOne({
            where: {
                [Op.and]: [
                    { userId: userId },
                    { postId: postId }
                ]
            }
        }).then(vote => {
            if (!vote) {
                return 0;
            }
            return vote.vote;
        })
        .catch(err => Promise.reject({ message: err }));
    }

    public create(vote: VoteAttributes): Promise<VoteAttributes> {
        return this.isAdmin(vote.userId).then(isAdmin => {
            if (!isAdmin) { /*Reject request if user is admin*/
                return Post.findByPk(vote.postId).then(found => {
                    if (!found) {
                        return Promise.reject({error: 'post_doesnt_exist', message: 'Post doesnt exist'});
                    }
                    if ((vote.vote > 1) || (vote.vote < -1)) {
                        return Promise.reject({error: 'wrong_vote_number', message: 'You can only vote 1,0,-1'});
                    }
                    return Vote.findOne({
                        where: {
                            [Op.and]: [
                                { userId: vote.userId },
                                { postId: vote.postId }
                            ]
                        }
                    }).then(foundVote => {
                        if (!foundVote) {
                            return Vote.create(vote).then(inserted => Promise.resolve(inserted)).catch(err => Promise.reject(err));
                        } else {
                            if (foundVote.vote !== vote.vote) {
                                foundVote.update({
                                    vote: vote.vote
                                });
                                return foundVote;
                            } else {
                                return Promise.reject({error: 'already_voted', message: 'Youve already voted on this post' });
                            }
                        }
                    });
                });
            }
            return Promise.reject({error: 'not_authorized', message: 'Admins are not authorized to create Posts' });
        });
    }

    private async isAdmin(userId: number): Promise<boolean> {
        return User.findByPk(userId).then(found => {
            if (!found) {
                return false;
            } else {
                return found.admin;
            }
        });
    }
}
